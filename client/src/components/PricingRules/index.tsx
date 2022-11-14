import { Box, Button, Container } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { ProductProp } from "../ProductCheckout";

interface PricingRuleProp {
  price: ProductProp[];
}

export interface RuleProp {
  key?: string;
  name: string;
  content: string;
}

type Discount = {
  name: string;
  pizzaSize: number;
  discountPrice: string;
};

type Deal = {
  name: string;
  get: number;
  for: number;
  pizzaSize: number;
};

const dealOptions = [
  {
    label: "discount",
    value: 1,
  },
  {
    label: "deal",
    value: 2,
  },
];

const pizzaSizeOptions = [
  {
    label: "small",
    value: 1,
  },
  {
    label: "medium",
    value: 2,
  },
  {
    label: "large",
    value: 3,
  },
];

const PricingRule = ({ price }: PricingRuleProp): JSX.Element => {
  const [rules, setRules] = useState<RuleProp[]>([]);
  const [pricingRuleOption, setPricingRuleOption] = useState<number>();
  const [pizzaDiscount, setPizzaDiscount] = useState<Discount>({
    name: "",
    pizzaSize: 1,
    discountPrice: "$12",
  });
  const [deal, setDeal] = useState<Deal>({
    name: "",
    get: 4,
    for: 3,
    pizzaSize: 1,
  });
  const [nameOpen, setNameOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>();

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

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const response = await fetch("/api/rules", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        (pricingRuleOption as number) === 1 ? { pizzaDiscount } : { deal }
      ),
    });
    const data = await response.json();
    alert(data.requestBody);
  };

  return (
    <Container maxWidth="xs">
      <Box m={10}>
        <form onSubmit={(e) => onSubmit(e)}>
          <div style={{ marginBottom: 15 }}>Add pricing rule</div>
          <Autocomplete
            disablePortal
            id="type"
            options={dealOptions}
            onChange={(e, v) => setPricingRuleOption(v?.value)}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="pricing rule" />
            )}
          />
          {pricingRuleOption === 1 ? (
            <>
              <TextField
                label="name"
                onChange={(e) =>
                  setPizzaDiscount({
                    ...pizzaDiscount,
                    name: e.target.value,
                  })
                }
                style={{ marginTop: 20 }}
              />
              <div style={{ marginTop: 15 }}>
                Please pick pizza to discount:
              </div>
              <Autocomplete
                disablePortal
                id="type-pizza"
                options={pizzaSizeOptions}
                onChange={(e, v) =>
                  setPizzaDiscount({
                    ...pizzaDiscount,
                    pizzaSize: v?.value as number,
                  })
                }
                sx={{ width: 300, marginTop: 3 }}
                renderInput={(params) => (
                  <TextField {...params} label="pizza size" />
                )}
              />
              <div style={{ marginTop: 15 }}>discount to</div>
              <TextField
                label="price"
                onChange={(e) =>
                  setPizzaDiscount({
                    ...pizzaDiscount,
                    discountPrice: e.target.value,
                  })
                }
                style={{ marginTop: 15 }}
              />
              <input type="submit" style={{ marginTop: 15 }} />
            </>
          ) : null}
          {pricingRuleOption === 2 ? (
            <>
              <TextField
                label="name"
                onChange={(e) => setDeal({ ...deal, name: e.target.value })}
                style={{ marginTop: 20 }}
                type="string"
              />
              <div style={{ marginTop: 15 }}>Get a</div>
              <TextField
                label="price"
                onChange={(e) =>
                  setDeal({ ...deal, get: Number(e.target.value) })
                }
                style={{ marginTop: 15 }}
                type="number"
              />
              <div style={{ marginTop: 15 }}>for</div>
              <TextField
                label="price"
                onChange={(e) => {
                  if (Number(e.target.value) > deal.get) {
                    alert("That's not a deal");
                    e.target.value = deal.get.toString();
                  } else {
                    setDeal({ ...deal, for: Number(e.target.value) });
                  }
                }}
                style={{ marginTop: 15 }}
                type="number"
              />{" "}
              <div style={{ marginTop: 15 }}>deal for</div>
              <Autocomplete
                disablePortal
                id="type-pizza"
                options={pizzaSizeOptions}
                onChange={(e, v) =>
                  setDeal({
                    ...deal,
                    pizzaSize: v?.value as number,
                  })
                }
                sx={{ width: 300, marginTop: 3 }}
                renderInput={(params) => (
                  <TextField {...params} label="pizza size" />
                )}
              />
              <input type="submit" style={{ marginTop: 15 }} />
            </>
          ) : null}
        </form>
      </Box>
    </Container>
  );
};

export default PricingRule;
