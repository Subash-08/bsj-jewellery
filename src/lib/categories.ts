// Category data structure for Shop By Category mega menu
export const CATEGORY_DATA = [
    {
        id: 'necklaces',
        name: 'Necklaces',
        subCategories: ['Choker', 'Long Haar', 'Pendant Sets', 'Mangalsutra', 'Chain', 'Locket'],
        gender: ['Women', 'Kids', 'Unisex'],
        occasion: ['Bridal', 'Festive', 'Party', 'Daily Wear'],
        collection: ['Royal Heritage', 'Lightweight', 'Temple Jewellery'],
        design: ['Antique', 'Modern', 'Kundan', 'Minakari'],
        price: ['Under ₹10k', '₹10k - ₹50k', '₹50k - ₹1L', 'Above ₹1L']
    },
    {
        id: 'bangles',
        name: 'Bangles',
        subCategories: ['Kada', 'Chudi', 'Bracelet', 'Cuff', 'Adjustable'],
        gender: ['Women', 'Men', 'Kids'],
        occasion: ['Wedding', 'Office', 'Daily Wear'],
        collection: ['Vivaha', 'Everyday Elegance'],
        design: ['Solid Gold', 'Stone Studded', 'Filigree'],
        price: ['Under ₹20k', '₹20k - ₹60k', 'Above ₹60k']
    },
    {
        id: 'earrings',
        name: 'Earrings',
        subCategories: ['Studs', 'Jhumkas', 'Drops', 'Hoops', 'Chandbali', 'Ear Cuffs'],
        gender: ['Women', 'Kids'],
        occasion: ['Party', 'Daily Wear', 'Festive'],
        collection: ['Glitter', 'Traditional'],
        design: ['Diamond', 'Gold', 'Polki'],
        price: ['Under ₹5k', '₹5k - ₹25k', 'Above ₹25k']
    },
    {
        id: 'rings',
        name: 'Rings',
        subCategories: ['Solitaire', 'Band', 'Cocktail', 'Engagement', 'Couple Rings'],
        gender: ['Women', 'Men', 'Unisex'],
        occasion: ['Engagement', 'Anniversary', 'Gift'],
        collection: ['Forever', 'Promise'],
        design: ['Modern', 'Classic', 'Vintage'],
        price: ['Under ₹15k', '₹15k - ₹50k', 'Above ₹50k']
    },
    {
        id: 'anklets',
        name: 'Anklets',
        subCategories: ['Single Chain', 'Broad Patti', 'Charm Anklets', 'Bridal Payal'],
        gender: ['Women', 'Kids'],
        occasion: ['Bridal', 'Daily Wear'],
        collection: ['Silver Shine', 'Traditional'],
        design: ['Plain Silver', 'Enamel', 'Stone'],
        price: ['Under ₹2k', '₹2k - ₹10k', 'Above ₹10k']
    },
    {
        id: 'chains',
        name: 'Chains',
        subCategories: ['Rope', 'Box', 'Snake', 'Figaro', 'Thali Chain'],
        gender: ['Men', 'Women', 'Unisex', 'Kids'],
        occasion: ['Daily Wear', 'Office'],
        collection: ['Basics', 'Heavy Weight'],
        design: ['Machine Cut', 'Handmade'],
        price: ['Under ₹15k', '₹15k - ₹1L', 'Above ₹1L']
    },
    {
        id: 'silver-articles',
        name: 'Silver Articles',
        subCategories: ['Idols', 'Silver Plates', 'Silver Glasses', 'Silver Vilakku', 'Silver Kada', 'Pooja Thali'],
        gender: ['Unisex'],
        occasion: ['Pooja', 'Gifting', 'House Warming', 'New Born'],
        collection: ['Divine', 'Home Decor'],
        design: ['Antique Finish', 'Glossy', 'Embossed'],
        price: ['Under ₹5k', '₹5k - ₹50k', 'Above ₹50k']
    },
    {
        id: 'nose-pin',
        name: 'Nose Pin',
        subCategories: ['Stud', 'Ring', 'Septum'],
        gender: ['Women'],
        occasion: ['Daily'],
        collection: ['Nath'],
        design: ['Diamond', 'Gold'],
        price: ['Under ₹2k']
    },
    {
        id: 'toe-ring',
        name: 'Toe Ring',
        subCategories: ['Adjustable', 'Band'],
        gender: ['Women'],
        occasion: ['Daily', 'Bridal'],
        collection: ['Silver'],
        design: ['Plain', 'Stone'],
        price: ['Under ₹1k']
    },
] as const;

export type CategoryId = typeof CATEGORY_DATA[number]['id'];
export type Category = typeof CATEGORY_DATA[number];
