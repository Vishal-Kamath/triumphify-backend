import z from "zod";

export const SignupSchema = z.object({
  username: z.string().trim().min(3).max(50),
  email: z.string().email().trim().min(1).max(100),
  gender: z.enum(["Male", "Female", "Other"]),
  dateOfBirth: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .refine((dob) => {
      return new Date(dob).getTime() < Date.now();
    })
    .refine((dob) => {
      return isUser18Plus(dob);
    }, "You must be 18 years or older"),
  password: z.string().trim().min(3).max(50),
});
export type SignupType = z.infer<typeof SignupSchema>;

export const LoginSchema = z.object({
  email: z.string().email().min(1).max(100),
  password: z.string().trim().min(3).max(50),
});
export type LoginType = z.infer<typeof LoginSchema>;

function isUser18Plus(birthdate: string) {
  const userBirthdate = new Date(birthdate);
  const currentDate = new Date();
  const ageDifference = currentDate.getFullYear() - userBirthdate.getFullYear();
  if (ageDifference > 18) {
    return true;
  } else if (ageDifference === 18) {
    if (currentDate.getMonth() > userBirthdate.getMonth()) {
      return true;
    } else if (currentDate.getMonth() === userBirthdate.getMonth()) {
      if (currentDate.getDate() >= userBirthdate.getDate()) {
        return true;
      }
    }
  }
  return false;
}
