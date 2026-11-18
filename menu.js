/* =========================================================
   Maroon Café — بيانات الموقع والمنيو
   عدّل هذا الملف فقط لتغيير الأسعار أو إضافة أصناف.
   - الأسعار بالدينار العراقي (أرقام فقط بدون فواصل)
   - الصورة: اسم الملف داخل مجلد images
   ========================================================= */

window.CAFE = {
  name: "Maroon Café",

  // رقم الواتساب بالصيغة الدولية (بدون + وبدون صفر البداية)
  whatsapp: "9647744600717",
  whatsappDisplay: "07744600717",

  instagram: "mar00n_cafe",

  currency: "د.ع",
};

// قسم "من نحن" (بعد المنيو). النص من بوست "منو مارون كافيه؟" بالإنستغرام.
// لإخفاء المميزات: خلي perks: []   ولإخفاء عرض الولاء: loyalty: null
window.ABOUT = {
  quote: "الحلم بلش بفكرة… والفكرة صارت واقع",
  text: "يمكن تستغربون من عنوان «أونلاين كافيه»، بس فكرتنا هي نختصر عليكم المسافة ونوصّلكم طعم القهوة المختصة والمشروبات المميزة لباب بيتكم ومكان شغلكم، بكل حب وإتقان.",
  perksTitle: "شنو يوصلك ويا طلبك",
  perks: [
    { icon: "i-bag",       title: "تغليف فاخر",          text: "باكجنج أنيق يفتح النفس" },
    { icon: "i-croissant", title: "ميني كرواسون هدية",   text: "ويا كل طلب" },
    { icon: "i-sticker",   title: "ستيكرات",             text: "مختلفة ومتنوعة" },
    { icon: "i-straw",     title: "القصبات الترند",       text: "متوفرة عدنا وبس" },
  ],
  loyalty: {
    title: "الكوب الخامس علينا",
    text: "ويا كل طلب يوصلك كوب صغير. اجمع 4 أكواب، ويصير كوب القهوة الخامس مجاناً.",
    cups: 4,
  },
};

// الصنف المميز: يظهر ببطاقة كبيرة بأول المنيو
window.FEATURED = {
  id: "karkadeh",
  label: "الوصفة الخاصة",
  name: "أيس كركديه",
  desc: "كركديه مثلّج بوصفتنا الخاصة، حصرياً في Maroon Café",
  price: 3500,
  img: "karkadeh.webp",
};

window.MENU = [
  {
    id: "iced",
    title: "قهوة مثلّجة",
    subtitle: "Iced Coffee",
    items: [
      { id: "iced-latte",      name: "أيس لاتيه",             desc: "اسبريسو، حليب",                                        price: 3500, img: "iced-latte.webp" },
      { id: "caramel-latte",   name: "أيس كراميل لاتيه",      desc: "اسبريسو، صوص الكراميل، حليب، مع الكولد فوم الخاص",       price: 4500, img: "caramel-latte.webp" },
      { id: "spanish-latte",   name: "سبانيش لاتيه",          desc: "اسبريسو مع الحليب المكثّف، مع الكولد فوم الخاص",          price: 4000, img: "spanish-latte.webp" },
      { id: "vanilla-latte",   name: "أيس فانيلا لاتيه",      desc: "اسبريسو، حليب، سيروب الفانيلا",                         price: 4500, img: "vanilla-latte.webp" },
      { id: "mocha",           name: "أيس موكا",              desc: "اسبريسو، حليب، صوص الشوكولاتة",                         price: 4500, img: "mocha.webp" },
      { id: "americano",       name: "أيس أمريكانو",          desc: "دبل شوت اسبريسو، ماء بارد، ثلج",                        price: 3000, img: "americano.webp" },
      { id: "pistachio-latte", name: "أيس بستاشيو لاتيه",     desc: "اسبريسو، صوص الفستق، حليب، مع الكولد فوم الخاص",         price: 5000, img: "pistachio-latte.webp" },
      { id: "lotus-latte",     name: "أيس لوتس لاتيه",        desc: "اسبريسو، صوص اللوتس، حليب، مع الكولد فوم الخاص",         price: 5000, img: "lotus-latte.webp" },
      { id: "dulce-latte",     name: "دولتشي دي ليتشي لاتيه", desc: "اسبريسو، حليب، صوص دولتشي دي ليتشي، مع الكولد فوم الخاص", price: 5000, img: "dulce-latte.webp" },
    ],
  },
  {
    id: "light",
    title: "قهوة دايت",
    subtitle: "Light Coffee",
    note: "بحليب خالي الدسم وسيروب خالي من السكر",
    items: [
      { id: "light-latte",   name: "أيس لاتيه دايت",        desc: "اسبريسو، حليب خالي الدسم",                                  price: 3500, img: "light-latte.webp" },
      { id: "light-vanilla", name: "أيس فانيلا لاتيه دايت", desc: "اسبريسو، حليب خالي الدسم، سيروب فانيلا خالي من السكر",       price: 4000, img: "light-vanilla.webp" },
      { id: "light-caramel", name: "أيس كراميل لاتيه دايت", desc: "اسبريسو، حليب خالي الدسم، سيروب كراميل خالي من السكر",       price: 4000, img: "light-caramel.webp" },
    ],
  },
];
