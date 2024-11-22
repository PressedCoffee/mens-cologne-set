// components/ComparisonTable.js

import React from "react";

const ComparisonTable = ({ products }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Cologne Set</th>
          <th>Price</th>
          <th>Features</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>
              <a href={`/product/${product.id}`}>{product.title}</a>
            </td>
            <td>
              {product.price} {product.currency}
            </td>
            <td>{product.features || "Feature summary not available."}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ComparisonTable;
