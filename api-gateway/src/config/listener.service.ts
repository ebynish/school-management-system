import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection} from 'mongoose';
import { Config } from './schemas/config.schema';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ChangeListenerService implements OnModuleInit {
  private client: ClientProxy;

  constructor(
    @InjectModel(Config.name) private readonly configModel: Model<Config>,
    @InjectConnection() private readonly connection: Connection,
  ) {
    // Initialize TCP client to communicate with notification service
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'localhost', port: 3222 }, // Adjust host and port as necessary
    });
  }

  async onModuleInit() {
    // Step 1: Retrieve the list of collections and conditions from the config model
    const config = await this.configModel.findOne();
    if (!config || !config.collections) {
      console.warn('No collections or conditions specified in the config');
      return;
    }

    // Step 2: Set up a change stream for each collection, applying conditions as filters
    config.collections.forEach(({ name: collectionName, conditions }) => {
      const collection = this.connection.collection(collectionName);

      // Create the match pipeline for conditions
      const matchStage = { $match: conditions || {} };

      // Step 3: Apply the change stream with the match conditions
      const changeStream = collection.watch([matchStage]);

      // Handle change events for this collection
      changeStream.on('change', async (change: any) => {
        console.log(`Change detected in collection ${collectionName}:`, change);

        let message = {
          to: config.adminEmail,
          templateType: 'alert',
          templateVariables: {
            operation: '',
            collectionName,
            data: change,
          },
          type: 'alert',
          logo: config.logoUrl,
        };

        switch (change.operationType) {
          case 'insert':
            message.templateVariables.operation = 'insert';
            message.templateVariables.data = change.fullDocument;
            break;
          case 'update':
            message.templateVariables.operation = 'update';
            message.templateVariables.data = change.updateDescription;
            break;
          case 'delete':
            message.templateVariables.operation = 'delete';
            message.templateVariables.data = change.documentKey;
            break;
          case 'drop':
            message.templateVariables.operation = 'drop';
            message.templateVariables.data = null;
            break;
          default:
            console.log('Unknown operation type');
            return; // Exit early for unsupported operation types
        }

        // Send the change event to the notification service over TCP
        try {
          await firstValueFrom(this.client.send({ cmd: 'notification' }, message));
          console.log('Event sent to notification service:', message);
        } catch (error) {
          console.error('Failed to send event to notification service:', error);
        }
      });

      // Handle errors on the change stream
      changeStream.on('error', (error) => {
        console.error(`Change stream error in collection ${collectionName}:`, error);
      });
    });
  }
}
