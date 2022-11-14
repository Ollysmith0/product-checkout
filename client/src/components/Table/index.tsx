import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Fab from "@mui/material/Fab";
import { useEffect, useState } from "react";
import { RuleProp } from "../PricingRules";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

interface rowsProp {
  name: string;
  description: string;
  price: string;
}

export interface tableProps {
  rows: rowsProp[];
}

export interface CartProp {
  smallPizza: number;
  mediumPizza: number;
  largePizza: number;
}

const ProductTable = ({ rows }: tableProps): JSX.Element => {
  const [quantity, setQuantity] = useState<CartProp>({
    smallPizza: 0,
    mediumPizza: 0,
    largePizza: 0,
  });
  const [rules, setRules] = useState<RuleProp[]>([]);
  const [name, setName] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/rules")
      .then((res) => res.json())
      .then((data) => {
        const convertedData = [
          ...new Map([...data.rules].map((m) => [m.id, m])).values(),
        ];
        setRules(convertedData);
      })
      .catch((err) => console.warn(err));
  }, []);

  const total = () => {
    let result = 0;
    const customerInfo = rules.filter((item) => {
      for (let key in item) {
        if (key === name) {
          return item[key as keyof typeof item];
        }
      }
    });

    const customerDiscountContent =
      customerInfo.length > 0
        ? customerInfo[0][name as keyof typeof customerInfo[0]]
        : undefined;

    if (customerDiscountContent) {
      const typeOfDeal = customerDiscountContent?.includes("discount")
        ? "discount"
        : "deal";

      const pizzaSize = customerDiscountContent?.includes("Small")
        ? "Small"
        : customerDiscountContent?.includes("Medium")
        ? "Medium"
        : "Large";

      const deal =
        typeOfDeal === "deal" &&
        customerDiscountContent?.split("").filter((item) => /\d/g.test(item));

      const discountPrice =
        (typeOfDeal === "discount" &&
          Number(
            customerDiscountContent?.substring(
              customerDiscountContent?.length - 1,
              customerDiscountContent?.length - 6
            )
          )) ||
        0;

      const discountTotal =
        typeOfDeal === "discount"
          ? pizzaSize === "Small"
            ? quantity.smallPizza * discountPrice
            : pizzaSize === "Medium"
            ? quantity.mediumPizza * discountPrice
            : quantity.largePizza * discountPrice
          : 0;

      const restTotal =
        pizzaSize === "Small"
          ? quantity.mediumPizza * 15.99 + quantity.largePizza * 21.99
          : pizzaSize === "Medium"
          ? quantity.smallPizza * 11.99 + quantity.largePizza * 21.99
          : quantity.mediumPizza * 15.99 + quantity.smallPizza * 11.99;
      if (typeOfDeal === "deal" && deal && deal.length > 1) {
        const getFromDeal = Number(deal[0]) - Number(deal[1]);
        const mustPayQuantity =
          pizzaSize === "Small"
            ? (quantity.smallPizza -
                getFromDeal *
                  Math.floor(quantity.smallPizza / Number(deal[0]))) *
              11.99
            : pizzaSize === "Medium"
            ? (quantity.mediumPizza -
                getFromDeal *
                  Math.floor(quantity.mediumPizza / Number(deal[0]))) *
              15.99
            : (quantity.largePizza -
                getFromDeal *
                  Math.floor(quantity.largePizza / Number(deal[0]))) *
              21.99;
        const discountDeal = mustPayQuantity;
        result = discountDeal + restTotal;
        console.log(discountDeal, restTotal, "deal");
      }

      if (typeOfDeal === "discount") {
        result = discountTotal + restTotal;
      }
    }
    if (!customerInfo.length) {
      result =
        quantity.smallPizza * 11.99 +
        quantity.mediumPizza * 15.99 +
        quantity.largePizza * 21.99;
    }

    return result;
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="center">Description</TableCell>
            <TableCell align="center">Price</TableCell>
            <TableCell align="center">Quantity</TableCell>
            <TableCell align="center">Action</TableCell>
            <TableCell align="center">Total Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: rowsProp) => {
            const isSmallRow = row.name.includes("Small");
            const isMediumRow = row.name.includes("Medium");
            let quantityType = isSmallRow
              ? quantity.smallPizza
              : isMediumRow
              ? quantity.mediumPizza
              : quantity.largePizza;
            if (quantityType < 0) {
              quantityType = 0;
            }
            return (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="center">{row.description}</TableCell>
                <TableCell align="center">{row.price}</TableCell>
                <TableCell align="center">{quantityType}</TableCell>
                <TableCell align="center">
                  {" "}
                  <Fab
                    size="small"
                    color="primary"
                    aria-label="add"
                    style={{ marginRight: 3 }}
                    onClick={() => {
                      if (row.name.includes("Small")) {
                        setQuantity({
                          ...quantity,
                          smallPizza: quantity.smallPizza + 1,
                        });
                      }
                      if (row.name.includes("Medium")) {
                        setQuantity({
                          ...quantity,
                          mediumPizza: quantity.mediumPizza + 1,
                        });
                      }
                      if (row.name.includes("Large")) {
                        setQuantity({
                          ...quantity,
                          largePizza: quantity.largePizza + 1,
                        });
                      }
                    }}
                  >
                    +
                  </Fab>
                  {quantityType >= 1 ? (
                    <Fab
                      size="small"
                      color="primary"
                      aria-label="remove"
                      onClick={() => {
                        if (row.name.includes("Small")) {
                          setQuantity({
                            ...quantity,
                            smallPizza: quantity.smallPizza - 1,
                          });
                        }
                        if (row.name.includes("Medium")) {
                          setQuantity({
                            ...quantity,
                            mediumPizza: quantity.mediumPizza - 1,
                          });
                        }
                        if (row.name.includes("Large")) {
                          setQuantity({
                            ...quantity,
                            largePizza: quantity.largePizza - 1,
                          });
                        }
                      }}
                    >
                      -
                    </Fab>
                  ) : null}
                </TableCell>
                <TableCell align="center">
                  {quantityType * Number(row.price.replace("$", "")) || 0}
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow key="total" sx={{ padding: 10, height: "2em" }}>
            <TableCell align="center">Total: {total()}</TableCell>
            <TableCell align="center">
              {isOpen ? (
                <TextField
                  label="Please fill your name"
                  onChange={(e: any) => setName(e.target.value)}
                  onKeyPress={(e: any) => {
                    if (e.key === "Enter" && name?.length >= 1) {
                      setIsOpen(false);
                    }
                  }}
                  style={{ marginTop: 20 }}
                  type="string"
                />
              ) : (
                <div>name: {name}</div>
              )}
            </TableCell>
            <TableCell align="center">
              <Button
                onClick={() => {
                  if (!name || name.length === 0) {
                    alert("you must fill your name first");
                  }
                  total();
                }}
              >
                Calculated Total
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductTable;
