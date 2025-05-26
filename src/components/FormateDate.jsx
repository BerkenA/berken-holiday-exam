function FormateDate({ date }) {
  if (!date) return <span>N/A</span>;

  const formatted = new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return <span>{formatted}</span>;
}

export default FormateDate;