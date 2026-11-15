export const MENU_CATEGORIES = ['Loaded Fries', 'Burgers', 'Shakes & Drinks', 'Desserts'];

const IMAGE_POOL = [
    '/images/menu/bread-barrel.jpg',
    '/images/menu/caesar.jpg',
    '/images/menu/cake.jpg',
    '/images/menu/greek-salad.jpg',
    '/images/menu/lobster-bisque.jpg',
    '/images/menu/lobster-roll.jpg',
    '/images/menu/mozzarella.jpg',
    '/images/menu/spinach-salad.jpg',
    '/images/menu/tuscan-grilled.jpg',
    '/images/fire-from-wok.jpg',
    '/images/scallop.jpg',
    '/images/chef-preparing-the-plates.jpg',
    '/images/nicely-plated-food-served-at-decorated-table.jpg',
    '/images/fancy-salmon-dish-with-wine-glasses-in-background.jpg',
];

const TAG_POOL = [
    'Fan Favorite',
    'Spicy',
    'Loaded',
    'Crispy',
    "Chef's Pick",
    'Shareable',
    'Best Seller',
    'Smoky',
    'Signature',
    'Cheesy',
    'Classic',
    'Indulgent',
    'Crowd Favorite',
    'Quick Bite',
];

const PRICE_BASE = { 'Loaded Fries': 350, Burgers: 650, 'Shakes & Drinks': 300, Desserts: 380 };
const PRICE_STEP = { 'Loaded Fries': 25, Burgers: 35, 'Shakes & Drinks': 20, Desserts: 20 };
const IMAGE_OFFSET = { 'Loaded Fries': 0, Burgers: 4, 'Shakes & Drinks': 8, Desserts: 11 };

const DESCRIPTIONS = {
    'Loaded Fries': [
        'Crispy fries buried under melted cheese, beef crumble, and house sauce.',
        'Hand-cut fries tossed in fiery peri peri spice, finished with garlic mayo.',
        'Loaded with smoky BBQ pulled beef, cheddar drizzle, and crispy onions.',
        'Golden, crispy, and simple — the fries that started it all.',
        'Piled high with jalapeños, nacho cheese, and a drizzle of ranch.',
        'Crispy fries tossed in garlic parmesan butter, fresh herbs.',
        'Loaded with spicy chicken chunks, cheese sauce, and chili flakes.',
        'Waffle-cut fries smothered in cheese and crispy beef bacon bits.',
    ],
    Burgers: [
        'Double beef patty, melted cheese, caramelized onions, house special sauce.',
        'Beef patty glazed in smoky BBQ sauce, crispy onion rings, smoked cheddar.',
        'Crispy fried chicken fillet, spicy mayo, fresh lettuce, toasted bun.',
        'Single patty drenched in a triple-cheese blend — simple, messy, worth it.',
        'Grilled beef patty, pickles, mustard, and a toasted sesame bun.',
        'Crispy zinger fillet stacked with cheese, coleslaw, and spicy sauce.',
        'Smashed beef patty, caramelized onions, American cheese, burger sauce.',
        'Double chicken patty, jalapeños, pepper jack cheese, chipotle mayo.',
    ],
    'Shakes & Drinks': [
        'Thick Nutella shake, whipped cream, chocolate drizzle, crushed wafers.',
        'Crushed Oreos blended into a creamy vanilla base, topped with cookie crumbs.',
        'Fresh-squeezed lemonade, mint, and a hint of soda for the fizz.',
        'Blended cold coffee, chocolate syrup, and a cloud of whipped cream.',
        'Classic strawberry shake, real fruit, whipped cream on top.',
        'Rich caramel shake swirled with salted caramel drizzle.',
        'Mango lassi-style blend, thick, cold, and refreshing.',
        'Peanut butter and banana blended into a thick, creamy shake.',
    ],
    Desserts: [
        'Warm chocolate brownie, molten center, vanilla ice cream, chocolate drizzle.',
        'Crisp waffle loaded with Nutella, banana slices, and powdered sugar.',
        'Crispy cinnamon-sugar churros served with warm chocolate dip.',
        'Layered chocolate mousse cake, rich and decadent.',
        'Classic cheesecake topped with a berry compote.',
        'Warm cookie skillet, melted chocolate chips, vanilla ice cream.',
        'Fudgy chocolate lava cake, served warm with a scoop of ice cream.',
        'Caramel drizzled ice cream sundae with crushed nuts.',
    ],
};

function buildItems(category, names) {
    return names.map((name, i) => ({
        category,
        name,
        description: DESCRIPTIONS[category][i % DESCRIPTIONS[category].length],
        price: `Rs. ${PRICE_BASE[category] + i * PRICE_STEP[category]}`,
        image: IMAGE_POOL[(IMAGE_OFFSET[category] + i) % IMAGE_POOL.length],
        tags: [
            TAG_POOL[i % TAG_POOL.length],
            TAG_POOL[(i + 4) % TAG_POOL.length],
            TAG_POOL[(i + 8) % TAG_POOL.length],
        ],
    }));
}

const LOADED_FRIES_NAMES = [
    'The KAVO Loaded', 'Peri Peri Fries', 'Smoky BBQ Fries', 'Classic Salted Fries',
    'Nacho Cheese Fries', 'Garlic Parmesan Fries', 'Spicy Chicken Fries', 'Waffle Bacon Fries',
    'Jalapeño Cheese Fries', 'Masala Fries', 'Mexican Loaded Fries', 'Cheese & Chili Fries',
    'Sour Cream & Onion Fries', 'Pizza Fries', 'Chipotle Mayo Fries', 'Loaded Curly Fries',
    'Buffalo Chicken Fries', 'Truffle Parmesan Fries', 'Four Cheese Fries', 'Crispy Masala Twist Fries',
    'BBQ Pulled Chicken Fries', 'Loaded Veggie Fries',
];

const BURGERS_NAMES = [
    'KAVO Signature Stack', 'Smoky BBQ Burger', 'Zinger Crunch Burger', 'Cheese Melt Burger',
    'Classic Beef Burger', 'Spicy Zinger Deluxe', 'Smash Burger', 'Jalapeño Chicken Burger',
    'Mushroom Swiss Burger', 'Double Trouble Burger', 'Grilled Chicken Burger', 'Peri Peri Chicken Burger',
    'BBQ Bacon Burger', 'Crispy Fish Burger', 'Chili Cheese Burger', 'Texas BBQ Burger',
    'Buffalo Chicken Burger', 'Hawaiian Burger', 'Mega Stack Burger', 'Garlic Mayo Zinger',
    'Beef & Cheese Slider', 'Spicy Beef Smash',
];

const SHAKES_NAMES = [
    'Nutella Overload Shake', 'Oreo Blast', 'Classic Lemonade', 'Iced Mocha Freeze',
    'Strawberry Shake', 'Salted Caramel Shake', 'Mango Lassi Freeze', 'Peanut Butter Banana Shake',
    'Chocolate Fudge Shake', 'Vanilla Bean Shake', 'Blueberry Blast', 'Pineapple Mint Cooler',
    'Red Velvet Shake', 'Cookies & Cream Shake', 'Mint Choc Chip Shake', 'Caramel Macchiato Freeze',
    'Classic Iced Tea', 'Fresh Orange Juice', 'Mixed Berry Smoothie', 'Pistachio Shake',
    'Coconut Cream Shake', 'Espresso Chiller',
];

const DESSERTS_NAMES = [
    'Molten Chocolate Brownie', 'Nutella Waffle', 'Churros & Dip', 'Chocolate Mousse Cake',
    'Classic Cheesecake', 'Warm Cookie Skillet', 'Chocolate Lava Cake', 'Caramel Ice Cream Sundae',
    'Red Velvet Cupcake', 'Tiramisu Cup', 'Biscoff Cheesecake', 'Nutty Chocolate Tart',
    'Vanilla Bean Panna Cotta', 'Oreo Cheesecake', 'Banana Split', 'Belgian Waffle Sundae',
    'Fudge Brownie Sundae', 'Caramel Flan', 'Strawberry Shortcake', 'Double Chocolate Donut',
    'Mini Pancake Stack', 'Apple Cinnamon Crumble',
];

export const MENU_ITEMS = [
    ...buildItems('Loaded Fries', LOADED_FRIES_NAMES),
    ...buildItems('Burgers', BURGERS_NAMES),
    ...buildItems('Shakes & Drinks', SHAKES_NAMES),
    ...buildItems('Desserts', DESSERTS_NAMES),
];
