import { render, screen, waitFor } from "@testing-library/react";
import ProductCheckout from "./index";
import * as Api from "../../Api";

jest.mock("../../Api");

describe("ProductCheckout Component", () => {
  it("should render when api response", async () => {
    const data = [
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

    
  });
});

export {};
