import { gql } from "apollo-server-express";

// User schemas
export default gql`
type application{
  id: Int!
  owner: User!
  name: String!
  email: String!
  phonenumber: String!
  address: String!
  city: String!
  state: String!
  zip: String!
  country: String!
  highereducation: Boolean!
  schoolname: [String!]!
  degree: [String!]!
  degreestatus: [String!]!
  schoolcountry: [String!]!
  employername: [String!]!
  jobtitle: [String!]!
  startdatemonth: [String!]!
  startdateyear: [String!]!
  enddatemonth: [String!]!
  enddateyear: [String!]!
  employercountry: [String!]!
  employercity: [String!]!
  employerstate: [String!]!
  currentemployer: Boolean
  jobs: [Job!]!
  coverletter: String
}

extend type Query{
    getApplication(id: Int!):application!
    getAllApplications:[application!]!
}

extend type Mutation{
  createApplication(
    name: String!
    email: String!
    phonenumber: String!
    address: String!
    city: String!
    state: String!
    zip: String!
    country: String!
    highereducation: Boolean!
    schoolname: [String!]!
    degree: [String!]!
    degreestatus: [String!]!
    schoolcountry: [String!]!
    employername: [String!]!
    jobtitle: [String!]!
    startdatemonth: [String!]!
    startdateyear: [String!]!
    enddatemonth: [String!]!
    enddateyear: [String!]!
    employercountry: [String!]!
    employercity: [String!]!
    employerstate: [String!]!
    currentemployer: Boolean
    coverletter: String
  ):Boolean!

  deleteApplication(id: ID!): Boolean!
}
`;
