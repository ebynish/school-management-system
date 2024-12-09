import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

const TableComponent = ({ component }) => {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          {component?.headers?.map((header, index) => (
            <Th key={index}>{header}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {component?.data?.map((row, rowIndex) => (
          <Tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <Td key={cellIndex}>{cell}</Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default TableComponent;
