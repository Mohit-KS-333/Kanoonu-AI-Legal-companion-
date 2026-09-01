export const quizLevels = [
  {
    level: 1,
    title: "Basic Traffic Rules",
    description: "Start your legal journey on the road. Do you know your traffic signs?",
    questions: [
      {
        id: 101,
        question: "What is the mandatory penalty for driving without a valid driving license in India?",
        options: ["₹500 fine", "₹5,000 fine", "Community service only", "₹10,000 fine"],
        correctIndex: 1,
        explanation: "Under the Motor Vehicles (Amendment) Act, 2019, the fine for driving without a license was increased from ₹500 to ₹5,000."
      },
      {
        id: 102,
        question: "What does a flashing red traffic light mean?",
        options: ["Speed up", "Stop, look, and proceed when safe", "Go carefully", "No entry"],
        correctIndex: 1,
        explanation: "A flashing red light behaves like a stop sign. You must come to a complete stop and proceed only when the way is clear."
      },
      {
        id: 103,
        question: "Is it mandatory to wear a helmet while riding a pillion on a bike?",
        options: ["No", "Only on highways", "Yes, everywhere", "Only at night"],
        correctIndex: 2,
        explanation: "Yes, under the Motor Vehicles Act, both the rider and the pillion rider must wear a helmet."
      }
    ]
  },
  {
    level: 2,
    title: "Consumer Rights",
    description: "Protect yourself from unfair trade practices.",
    questions: [
      {
        id: 201,
        question: "Which mark certifies the purity of gold jewellery?",
        options: ["ISI Mark", "Agmark", "BIS Hallmark", "FSSAI Logo"],
        correctIndex: 2,
        explanation: "The BIS Hallmark is a certification of purity of gold jewellery in India."
      },
      {
        id: 202,
        question: "Can a shopkeeper charge more than the MRP?",
        options: ["Yes, for cooling charges", "No, never", "Yes, in malls", "Yes, if tax is extra"],
        correctIndex: 1,
        explanation: "No. Charging more than the Maximum Retail Price (MRP) is an unfair trade practice under the Legal Metrology Act."
      },
      {
        id: 203,
        question: "Where can you file a complaint for a defective product worth ₹15 Lakhs?",
        options: ["District Consumer Commission", "State Commission", "National Commission", "Supreme Court"],
        correctIndex: 0,
        explanation: "For claims up to ₹1 Crore (as per new Consumer Protection Act 2019 rules), the complaint lies with the District Consumer Disputes Redressal Commission."
      }
    ]
  },
  {
    level: 3,
    title: "Cyber Law & Safety",
    description: "Stay safe in the digital world.",
    questions: [
      {
        id: 301,
        question: "Section 66A of the IT Act (punishment for offensive messages) was struck down in which year?",
        options: ["2012", "2015", "2018", "2020"],
        correctIndex: 1,
        explanation: "Section 66A was struck down in the landmark Shreya Singhal v. Union of India case in 2015 for being unconstitutional."
      },
      {
        id: 302,
        question: "Is using someone else's Wi-Fi without permission a crime?",
        options: ["No", "Yes, it is theft of service", "Only if you download movies", "Only if it is password protected"],
        correctIndex: 1,
        explanation: "Yes, accessing a computer network (including Wi-Fi) without permission is punishable under the IT Act."
      },
      {
        id: 303,
        question: "What is the punishment for identity theft under the IT Act?",
        options: ["No punishment", "Up to 3 years imprisonment", "Fine only", "Life imprisonment"],
        correctIndex: 1,
        explanation: "Section 66C of the IT Act prescribes punishment for identity theft, which may extend to 3 years imprisonment."
      }
    ]
  },
  {
    level: 4,
    title: "Criminal Law Basics",
    description: "Know your rights when dealing with the law.",
    questions: [
      {
        id: 401,
        question: "Can a police officer refuse to file an FIR for a cognizable offense?",
        options: ["Yes, if they are busy", "No, it is mandatory", "Yes, if the crime happened in another jurisdiction", "Only with permission from SP"],
        correctIndex: 1,
        explanation: "No. A police officer is duty-bound to register an FIR. If it's outside jurisdiction, a 'Zero FIR' must be filed."
      },
      {
        id: 402,
        question: "What is 'Anticipatory Bail'?",
        options: ["Bail after arrest", "Bail before arrest", "Bail for minor crimes", "Automatic bail"],
        correctIndex: 1,
        explanation: "Anticipatory bail is granted under Section 438 CrPC to a person who apprehends arrest, allowing them to remain free before arrest is made."
      },
      {
        id: 403,
        question: "Can a woman be arrested after sunset?",
        options: ["Yes", "No, unless exceptional circumstances exist", "Only with family present", "Only by male officers"],
        correctIndex: 1,
        explanation: "Generally, a woman cannot be arrested between sunset and sunrise except in exceptional circumstances and with a Magistrate's order."
      }
    ]
  },
  {
    level: 5,
    title: "Constitution & Fundamental Rights",
    description: "The supreme law of the land.",
    questions: [
      {
        id: 501,
        question: "Which Fundamental Right cannot be suspended even during a National Emergency?",
        options: ["Right to Speech", "Right to Assemble", "Art 20 & 21 (Protection in respect of conviction & Life)", "Right to Move Freely"],
        correctIndex: 2,
        explanation: "Articles 20 and 21 cannot be suspended even during an emergency."
      },
      {
        id: 502,
        question: "Right to Education (Article 21A) guarantees free education for children of which age group?",
        options: ["0-6 years", "6-14 years", "6-18 years", "5-15 years"],
        correctIndex: 1,
        explanation: "Article 21A provides free and compulsory education to all children of the age of 6 to 14 years."
      },
      {
        id: 503,
        question: "Who is the custodian of the Constitution of India?",
        options: ["The President", "The Prime Minister", "The Supreme Court", "The Parliament"],
        correctIndex: 2,
        explanation: "The Supreme Court of India is considered the custodian and final interpreter of the Constitution."
      }
    ]
  }
];
