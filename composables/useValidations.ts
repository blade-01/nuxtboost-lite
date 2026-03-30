import { object, string, ref as yref, array, date, mixed, number } from "yup";
import { isValidPhoneNumber } from "libphonenumber-js";
export default function () {
  // Validation messages
  const validation = {
    required: (field: string) => `${field} is required`,
    alphabet: (field: string) => `${field} should only contain alphabets`,
    url: (field: string) => `${field} should be a valid URL - https://...`,
    min: (field: string, limit?: number) =>
      `${field} must be at least ${limit} characters`,
    max: (field: string, limit?: number) =>
      `${field} must be at most ${limit} characters`,
    valid: (field: string) => `Please provide a valid ${field}`,
    password:
      "Provide a password with at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
    password_confirmation: "Please ensure your passwords match",
  };

  const requiredStringField = (field: string) =>
    string().required(validation.required(field));

  const requiredArrayField = (field: string) =>
    array()
      .of(string().required())
      .test("length", validation.required(field), (value) => value?.length > 0)
      .required(validation.required(field));

  const requiredDateField = (field: string) =>
    date()
      .required(validation.required(field))
      .typeError(validation.valid(field));

  const requiredValueField = (
    field: string,
    predicate: (value: unknown) => boolean,
  ) =>
    mixed()
      .required(validation.required(field))
      .test("valid-value", validation.valid(field), predicate);

  const emailField = (field = "Email") =>
    string()
      .required(validation.required(field))
      .email(validation.valid(field))
      .matches(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z-0-9]+\.)+[a-zA-Z]{2,}))$/,
        validation.valid(field),
      );

  const passwordField = () =>
    string()
      .required(validation.password)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]:";'<>,.?\\/|!"#$%&'()*+,-./:;<=>?@^_`{|}~])(?=.{8,})/,
        validation.password,
      );

  // Validation schema
  const mainSchema = object({
    first_name: string()
      .matches(/^[^\d]*$/, validation.alphabet("First name"))
      .required(validation.required("First name"))
      .min(1)
      .max(100),
    last_name: string()
      .matches(/^[^\d]*$/, validation.alphabet("Last name"))
      .required(validation.required("Last name"))
      .min(1, validation.min("Last name", 1))
      .max(100, validation.max("Last name", 100)),
    email: emailField(),
    portfolio: string()
      .url(validation.url("Portfolio"))
      .required(validation.required("Portfolio")),
    currency: number()
      .required(validation.required("Currency"))
      .typeError(validation.valid("Currency")),
    password: passwordField(),
    password_confirmation: string()
      .required(validation.password_confirmation)
      .oneOf([yref("password")], validation.password_confirmation),
    message: string()
      .required(validation.required("Message"))
      .min(1, validation.min("Message", 1))
      .max(100, validation.max("Message", 100)),
    gender: requiredStringField("Gender"),
    country: requiredArrayField("Country"),
    city: requiredArrayField("City"),
    date: requiredDateField("Date"),
    month: requiredValueField(
      "Month",
      (value) =>
        !!value &&
        typeof value === "object" &&
        typeof value.month === "number" &&
        typeof value.year === "number",
    ),
    year: requiredValueField(
      "Year",
      (value) =>
        typeof value === "number" ||
        value instanceof Date ||
        (typeof value === "object" && typeof value?.year === "number"),
    ),
    date_time: requiredDateField("Date Time"),
    time: requiredValueField(
      "Time",
      (value) =>
        !!value &&
        typeof value === "object" &&
        typeof value.hours === "number" &&
        typeof value.minutes === "number",
    ),
    multiple: array()
      .of(date().required())
      .required(validation.required("Multiple Dates"))
      .test(
        "length",
        validation.required("Multiple Dates"),
        (value) => value.length > 0,
      )
      .typeError(validation.valid("Multiple Dates")),
    range: array()
      .of(date().required())
      .required(validation.required("Date Range"))
      .test(
        "length",
        validation.required("Date Range"),
        (value) => value.length > 0,
      )
      .typeError(validation.valid("Date Range")),
    phone_number: string().test(
      "phone",
      validation.valid("Phone Number"),
      (value) => {
        if (!value) return true;
        return isValidPhoneNumber(value);
      },
    ),
    autocomplete: requiredStringField("Autocomplete"),
    chips: requiredArrayField("Multiple Inputs"),
    file: mixed().required(validation.required("File")),
    files: array()
      .of(mixed().required())
      .test("length", validation.required("Files"), (value) => value.length > 0)
      .required(validation.required("Files")),
    image: mixed().required(validation.required("File")),
    images: array()
      .of(mixed().required())
      .test(
        "length",
        validation.required("Images"),
        (value) => value.length > 0,
      )
      .required(validation.required("Images")),
  });

  const signinSchema = object({
    email: emailField("Email"),
    password: requiredStringField("Password"),
  });

  const signupSchema = object({
    full_name: string()
      .required(validation.required("Full name"))
      .min(2, validation.min("Full name", 2))
      .max(100, validation.max("Full name", 100)),
    email: emailField("Work email"),
    password: passwordField(),
    password_confirmation: string()
      .required(validation.password_confirmation)
      .oneOf([yref("password")], validation.password_confirmation),
  });

  const forgotPasswordSchema = object({
    email: emailField("Email"),
  });

  const otpSchema = object({
    otp: string()
      .required(validation.required("OTP"))
      .matches(/^\d{4,6}$/, validation.valid("OTP")),
  });

  const resetPasswordSchema = object({
    password: passwordField(),
    password_confirmation: string()
      .required(validation.password_confirmation)
      .oneOf([yref("password")], validation.password_confirmation),
  });

  return {
    mainSchema,
    signinSchema,
    signupSchema,
    forgotPasswordSchema,
    otpSchema,
    resetPasswordSchema,
  };
}
