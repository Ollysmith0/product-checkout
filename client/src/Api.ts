export const fetchPrice = () => {
    return fetch("/api/price")
      .then((res) => res.json())
}