exports.corporate = [
  {
    step: 0,
    fields: [
      { label: "Company Name", name: "companyName", type: "field", inputType: "text", isRequired: true },
      { label: "Registration Number", name: "registrationNumber", type: "field", inputType: "text", isRequired: true },
      { label: "TIN (Tax Identification Number)", name: "tin", type: "field", inputType: "text", isRequired: true },
      { label: "Date of Incorporation", name: "incorporationDate", type: "field", inputType: "date", isRequired: true },
      { label: "Industry", name: "industry", type: "field", inputType: "text", isRequired: true },
    ],
  },
  {
    step: 1,
    fields: [
      { label: "Head Office Address", name: "headOfficeAddress", type: "field", inputType: "text", isRequired: true },
      { label: "City / Town", name: "city", type: "field", inputType: "text", isRequired: true },
      { label: "LGA", name: "lga", type: "field", inputType: "text", isRequired: true },
      { label: "State", name: "state", type: "field", inputType: "text", isRequired: true },
    ],
  },
  {
    step: 2,
    fields: [
      { label: "Phone Number", name: "phoneNumber", type: "field", inputType: "text", isRequired: true },
      { label: "Email Address", name: "email", type: "field", inputType: "email", isRequired: true },
    ],
  },
  {
    step: 3,
    fields: [
      {
        label: "Directors",
        name: "directors",
        type: "section",
        fields: [
          { label: "Director's Name", name: "directorName", type: "field", inputType: "text", isRequired: true },
          { label: "Director's Position", name: "directorPosition", type: "field", inputType: "text", isRequired: true },
          { label: "Director's Phone Number", name: "directorPhoneNumber", type: "field", inputType: "text", isRequired: true },
          { label: "Director's Email Address", name: "directorEmail", type: "field", inputType: "email", isRequired: true },
          {
            label: "Identification Type",
            name: "identificationType",
            type: "field",
            inputType: "select",
            options: ["National ID", "Passport", "Driver's License", "Voter's Card"],
            isRequired: true,
          },
          { label: "Identification Number", name: "identificationNumber", type: "field", inputType: "text", isRequired: true },
        ],
      },
      { label: "Signature", name: "signature", type: "field", inputType: "text", isRequired: true },
      { label: "Date", name: "date", type: "field", inputType: "date", isRequired: true },
    ],
  },
];

  
  exports.individual = [
    {
      step: 0,
      fields: [
        { label: "Surname", name: "surname", type: "field", inputType: "text", isRequired: true },
        { label: "First Name", name: "firstName", type: "field", inputType: "text", isRequired: true },
        { label: "Other Names", name: "otherNames", type: "field", inputType: "text", isRequired: false },
        { label: "Mother's Maiden Name", name: "mothersMaidenName", type: "field", inputType: "text", isRequired: true },
        { label: "Date of Birth", name: "dob", type: "field", inputType: "date", isRequired: true },
        { label: "Gender", name: "gender", type: "field", inputType: "text", isRequired: true },
        { label: "Title", name: "title", type: "field", inputType: "text", isRequired: false },
        { label: "Nationality", name: "nationality", type: "field", inputType: "text", isRequired: true },
      ],
    },
    {
      step: 1,
      fields: [
        { label: "Means of Identification", name: "meansOfIdentification", type: "field", inputType: "text", isRequired: true },
        { label: "ID Number", name: "idNumber", type: "field", inputType: "text", isRequired: true },
        { label: "ID Issue Date", name: "idIssueDate", type: "field", inputType: "date", isRequired: true },
        { label: "ID Expiry Date", name: "idExpiryDate", type: "field", inputType: "date", isRequired: true },
        { label: "Bank Verification Number (BVN)", name: "bankVerificationNumber", type: "field", inputType: "text", isRequired: true },
      ],
    },
    {
      step: 2,
      fields: [
        { label: "House Number", name: "houseNumber", type: "field", inputType: "text", isRequired: true },
        { label: "Street Name", name: "streetName", type: "field", inputType: "text", isRequired: true },
        { label: "Nearest Bus Stop / Landmark", name: "nearestBusStop", type: "field", inputType: "text", isRequired: false },
        { label: "City / Town", name: "city", type: "field", inputType: "text", isRequired: true },
        { label: "LGA", name: "lga", type: "field", inputType: "text", isRequired: true },
        { label: "State", name: "state", type: "field", inputType: "text", isRequired: true },
      ],
    },
    {
      step: 3,
      fields: [
        { label: "Phone Number (1)", name: "phoneNumber1", type: "field", inputType: "text", isRequired: true },
        { label: "Phone Number (2)", name: "phoneNumber2", type: "field", inputType: "text", isRequired: false },
        { label: "Email Address", name: "emailAddress", type: "field", inputType: "email", isRequired: true },
      ],
    },
    {
      step: 4,
      fields: [
        { label: "Signature", name: "signature", type: "field", inputType: "text", isRequired: true },
        { label: "Date", name: "date", type: "field", inputType: "date", isRequired: true },
      ],
    },
  ];
  

exports.ordinary = [{
  "fields": [
    { "label": "Username", "name": "username", "type": "field", "inputType": "text", "isRequired": true },
    { "label": "Password", "name": "password", "type": "field", "inputType": "password", "isRequired": true },
    { "label": "Email", "name": "email", "type": "field", "inputType": "email", "isRequired": true },
    { "label": "Phone Number", "name": "phoneNumber", "type": "field", "inputType": "text", "isRequired": false },
    {
      "label": "Address",
      "name": "address",
      "type": "section",
      "fields": [
        { "label": "Street", "name": "street", "type": "field", "inputType": "text", "isRequired": true },
        { "label": "City", "name": "city", "type": "field", "inputType": "text", "isRequired": true },
        { "label": "State", "name": "state", "type": "field", "inputType": "text", "isRequired": true },
        { "label": "Postal Code", "name": "postalCode", "type": "field", "inputType": "text", "isRequired": true }
      ]
    },
    {
      "label": "Preferences",
      "name": "preferences",
      "type": "section",
      "fields": [
        { "label": "Subscribe to Newsletter", "name": "subscribe", "type": "field", "inputType": "checkbox", "isRequired": false },
        { "label": "Preferred Contact Method", "name": "contactMethod", "type": "field", "inputType": "select", "options": ["Email", "Phone", "Mail"], "isRequired": true }
      ]
    }
  ],
  "step": null
}]