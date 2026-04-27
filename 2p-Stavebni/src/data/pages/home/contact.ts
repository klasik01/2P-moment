import type { ContactContent } from "../../../types/content";
import {
  companyContactLines,
  contacts,
  officeContactLines,
} from "../../contacts";
import { registrationLine } from "../../legal";

export const contact: ContactContent = {
  label: "Spojte se s námi",
  title: "Jak nás",
  titleAccent: "kontaktovat?",
  description:
    "Potřebujete pomoc s vaší stavbou? Rádi byste využili naše služby? Spojte se s našimi odborníky, kteří vám rádi pomohou najít nejlepší řešení.",
  companyLines: companyContactLines,
  officeLines: officeContactLines,
  registration: registrationLine,
  phone: contacts.phone,
  email: contacts.email,
  team: [],
};
