export const handleMongooseValidationError = (error: any) => {
  const errors = Object.values(error.errors).map(
    (err: any) => ({
      field: err.path,
      message: err.message,
    })
  );

  return {
    statusCode: 400,
    message: "Please provide all required product information.",
    errors,
  };
};