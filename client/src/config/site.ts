export const SITE = {
  author: "خليفة جمعة الرميثي",
  name: "خارج النص",
  instagramHandle: "kjalromaithi",
  instagramUrl: "https://www.instagram.com/kjalromaithi/",
  // Set a verified international number, digits only, to enable WhatsApp links.
  whatsappNumber: "" as string,
  portraitUrl: "/media/YmbibFaRiUfZjDYH.jpg",
  calligraphyUrl: "/media/kharij-alnass-calligraphy-bg-jNhSnM3nVz85joMPP3VWgB.webp",
};

export const whatsappUrl = /^\d{8,15}$/.test(SITE.whatsappNumber)
  ? `https://wa.me/${SITE.whatsappNumber}`
  : null;
