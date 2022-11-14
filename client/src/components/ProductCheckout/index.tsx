import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useEffect, useState } from "react";
import { fetchPrice } from "../../Api";
import PricingRule from "../PricingRules";
import ProductTable from "../Table";

export interface ProductProp {
  name: string;
  description: string;
  price: string;
}

const createData = (name: string, description: string, price: string) => {
  return { name, description, price };
};

const ProductCheckout = () => {
  const [rows, setRows] = useState<Array<ProductProp>>([]);
  useEffect(() => {
    fetchPrice()
      .then((data) => {
        const convertedData = data.price.map((item: ProductProp) => {
          const { name, description, price } = item;
          return createData(name, description, price);
        });
        setRows(convertedData);
      })
      .catch((err) => console.warn(err));
  }, []);

  return (
    <Container maxWidth="lg">
      <Box m={10}>
        <ProductTable rows={rows} />
        <PricingRule price={rows} />
      </Box>
    </Container>
  );
};

export default ProductCheckout;
