import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Form, FormSchema } from '../schemas/form.schema';
import { FormService } from '../services/form.service';
import { FormClientController } from 'src/controllers/form.controller';
import { IntegrationsService } from 'src/integrations/services/integration.service';
import { FlutterwaveService } from 'src/integrations/services/flutterwave.service';
import { AuditTrail, AuditTrailSchema } from 'src/schemas/audit.schema';
import { AuditService } from 'src/services/audit.service';
import { ApprovalRuleService } from 'src/services/approval-rule.service';
import { ApprovalRule, ApprovalRuleSchema} from 'src/schemas/approval-rule.schema';
import { ApprovalWorkflow, ApprovalWorkflowSchema } from 'src/schemas/approval-workflow.schema';
import { ApprovalWorkflowService } from 'src/services/approval-workflow.service';
import { ApprovalRuleController } from 'src/controllers/approval-rule.controller';
import { ApprovalWorkflowController } from 'src/controllers/approval-workflow.controller';
import { RemitaService } from 'src/integrations/services/remita.service';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/school'),
    MongooseModule.forFeature([{ name: Form.name, schema: FormSchema }, 
      { name: AuditTrail.name, schema: AuditTrailSchema },
      { name: ApprovalRule.name, schema: ApprovalRuleSchema },
      { name: ApprovalWorkflow.name, schema: ApprovalWorkflowSchema }
    ]),
  ],
  providers: [FormService, IntegrationsService, FlutterwaveService, 
    AuditService, ApprovalRuleService, ApprovalWorkflowService, RemitaService],
  controllers: [FormClientController, ApprovalRuleController, ApprovalWorkflowController],
  exports: [FormService],
})
export class FormModule {}
