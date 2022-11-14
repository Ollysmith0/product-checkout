import { render, screen } from "@testing-library/react";
import ProductTable from ".";

test("loads and displays product table", async () => {
  // ARRANGE
  render(
    <ProductTable
      rows={[
        { name: "a", description: "a", price: "a" },
        { name: "b", description: "b", price: "b" },
      ]}
    />
  );

  // ASSERT
  expect(screen.getByRole('table')).toBeInTheDocument();
});
