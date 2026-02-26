export const getDummyVisaData = (countryId) => {
  const data = {
    dubai: {
      country: "Dubai",
      heroImage:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop",
      title: "Dubai Visa Online for Indians",
      approvalRate: "99.2% Visas Approved before Time",
      processingTime: "Up to 48 hours",
      startingPrice: "₹3,499/-",
      agentBadge: "Authorised Visa Agent - Official Partner of UAE Government",
      visaTypes: [
        {
          name: "48 Hours Transit Visa",
          processing: "Upto 5 days",
          stay: "2 days",
          validity: "30 days",
          entry: "Single",
          fees: "INR 3,499/-",
          popular: false,
        },
        {
          name: "30 Days Tourist Visa",
          processing: "Upto 5 days",
          stay: "30 days",
          validity: "58 days",
          entry: "Single",
          fees: "INR 7,899/-",
          popular: true,
        },
        {
          name: "30 Days Family Tourist Visa",
          subtext: "(Includes 2 Adults + 1 Child)",
          processing: "Upto 5 days",
          stay: "30 days",
          validity: "58 days",
          entry: "Single",
          fees: "INR 19,999/-",
          popular: true,
        },
        {
          name: "96 Hours Transit Visa",
          processing: "Upto 5 days",
          stay: "4 days",
          validity: "30 days",
          entry: "Single",
          fees: "INR 5,299/-",
          popular: false,
        },
      ],
      documents: [
        "Scanned colour copy of first and last page of your valid Passport",
        "Scanned colour copy of your passport size photograph with white background",
        "Confirmed return flight tickets",
        "Hotel booking details",
      ],
      faqs: [
        {
          q: "How much Dubai visa cost?",
          a: "The cost depends on the type of visa you choose. Transit visas start from ₹3,499/- while 30 Days Tourist visas are around ₹7,899/-.",
        },
        {
          q: "Is a Dubai visa free for Indians?",
          a: "No, Indian citizens require a pre-approved visa to enter Dubai unless they hold a valid US/UK/Schengen visa for visa-on-arrival.",
        },
        {
          q: "How to apply for a Dubai visa for Indian Citizens?",
          a: "You can apply online by submitting your passport copies, photo, and flight tickets. We handle the process and email your approved visa.",
        },
        {
          q: "What are the Golden Dubai Visa benefits?",
          a: "Golden visa offers long-term residency, ability to sponsor family without specific job restrictions, and extended time outside the UAE without visa invalidation.",
        },
        {
          q: "What is the Dubai Golden Visa price?",
          a: "The price varies significantly depending on the investment or professional category you are qualifying under.",
        },
      ],
      whyChooseUs: [
        { icon: "🛂", title: "Visa services for all countries" },
        { icon: "🏆", title: "45+ years of experience in visa processing" },
        { icon: "🌍", title: "150+ branches worldwide" },
        { icon: "✅", title: "99.8% visa success rate" },
        { icon: "🎧", title: "Start-to-end visa assistance" },
        { icon: "🚚", title: "Pick up & drop of documents at your doorstep" },
      ],
    },
    // Adding generic fallbacks for others
  };

  const generic = {
    ...data.dubai,
    country: countryId.charAt(0).toUpperCase() + countryId.slice(1),
    title: `${countryId.charAt(0).toUpperCase() + countryId.slice(1)} Visa Online for Indians`,
    heroImage:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop",
  };

  return data[countryId.toLowerCase()] || generic;
};
