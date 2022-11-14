const express = require("express");
const morgan = require("morgan");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());

app.use(morgan("combined"));

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

const rules = [
  {
    id: 1,
    Facebook: "5 for 4 deal for Medium Pizza",
  },
  {
    id: 2,
    Microsoft: "3 for 2 deal for Small Pizza",
  },
  {
    id: 3,
    Amazon: "Large Pizza discount to 19.99$",
  },
];

app.get("/api/rules", (req, res) => {
  res.json({ rules });
});

app.post("/api/rules", (req, res) => {
  const pizzaSizeConverter = {
    1: "Small Pizza",
    2: "Medium Pizza",
    3: "Large Pizza",
  };

  const { pizzaDiscount, deal } = req.body;

  const convertData = pizzaDiscount
    ? {
        id: rules.length + 1,
        [pizzaDiscount.name]: `${pizzaSizeConverter[pizzaDiscount.pizzaSize]} discount to ${pizzaDiscount.discountPrice}$`,
      }
    : {
        id: rules.length + 1,
        [deal.name]: `Get a ${deal.get} for ${deal.for} deal for ${pizzaSizeConverter[deal.pizzaSize]}`,
      };

  rules.push(convertData);
  const convertedData = [...new Map([...rules].map((m) => [m.id, m])).values()];
  res.json({ requestBody: convertedData });
});

app.get("/api/price", (req, res) => {
  const price = [
    {
      name: "Small Pizza",
      description: "10'' pizza for one person",
      price: "$11.99",
    },
    {
      name: "Medium Pizza",
      description: "12'' Pizza for two persons",
      price: "$15.99",
    },
    {
      name: "Large Pizza",
      description: "15'' Pizza for four persons",
      price: "$21.99",
    },
  ];
  res.json({ price });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
