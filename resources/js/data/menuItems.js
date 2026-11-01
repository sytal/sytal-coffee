export const MENU_CATEGORIES = ['Coffee', 'Breakfast', 'Mains', 'Desserts'];

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
    'Single-Origin',
    'Slow-Brewed',
    'House Blend',
    'Seasonal',
    'Chef\'s Special',
    'Hand-Finished',
    'Wood-Fired',
    'Direct-Trade',
    'Small-Batch',
    'Locally Sourced',
    'Cold-Pressed',
    'Aged',
    'Char-Grilled',
    'Family Recipe',
];

function buildItems(category, names) {
    return names.map((name, i) => ({
        category,
        name,
        description:
            DESCRIPTIONS[category][i % DESCRIPTIONS[category].length],
        price: `$${(PRICE_BASE[category] + i * PRICE_STEP[category]).toFixed(2)}`,
        image: IMAGE_POOL[(IMAGE_OFFSET[category] + i) % IMAGE_POOL.length],
        tags: [
            TAG_POOL[i % TAG_POOL.length],
            TAG_POOL[(i + 3) % TAG_POOL.length],
            TAG_POOL[(i + 6) % TAG_POOL.length],
        ],
    }));
}

const PRICE_BASE = { Coffee: 4, Breakfast: 10, Mains: 20, Desserts: 8 };
const PRICE_STEP = { Coffee: 0.25, Breakfast: 0.4, Mains: 0.75, Desserts: 0.3 };
const IMAGE_OFFSET = { Coffee: 0, Breakfast: 3, Mains: 7, Desserts: 10 };

const DESCRIPTIONS = {
    Coffee: [
        'Single-origin beans, dark cocoa notes, pulled to order.',
        'Slow-brewed light roast with a honeyed, floral finish.',
        'Equal parts espresso and steamed milk, velvet texture.',
        'House espresso, cardamom-infused milk, gold dusting.',
        'Cold-extracted for eighteen hours, smooth and low-acid.',
        'Double shot over vanilla bean cream, lightly whipped.',
        'Whole-bean pour, citrus brightness, clean finish.',
        'Steamed oat milk, toasted hazelnut syrup, cinnamon dust.',
    ],
    Breakfast: [
        'Baked eggs in spiced tomato, black truffle shavings.',
        'Stacked buttermilk pancakes, burnt honey, cultured cream.',
        'Sourdough, whipped avocado, citrus-cured salmon.',
        'Charred sourdough, confit garlic, heirloom tomato.',
        'Folded omelette, aged gruyère, wild mushroom.',
        'Granola, poached pear, honeyed yogurt.',
        'Brioche French toast, salted maple, seasonal berries.',
    ],
    Mains: [
        'Cherry gastrique, charred fennel, potato gratin.',
        'Slow-cooked Arborio, saffron, aged parmesan, gold leaf.',
        'Brown butter, heirloom greens, roasted lemon jus.',
        'Dry-aged ribeye, bone marrow butter, charred shallot.',
        'Wood-fired, confit garlic, rosemary jus.',
        'Pan-roasted, root vegetable purée, red wine reduction.',
        'Hand-rolled pasta, slow-braised short rib ragù.',
    ],
    Desserts: [
        'Molten center, salted caramel, vanilla bean ice cream.',
        'Roasted figs, whipped mascarpone, honeyed pistachio.',
        'Layered mascarpone, house espresso, cocoa dust.',
        'Burnt Basque cheesecake, seasonal berry coulis.',
        'Dark chocolate ganache, candied orange, sea salt.',
        'Caramelized pear tart, almond frangipane.',
    ],
};

const COFFEE_NAMES = [
    'Signature Espresso', 'Golden Pour-Over', 'Maison Cortado', 'Spiced Cardamom Latte',
    'Eighteen-Hour Cold Brew', 'Vanilla Bean Affogato', 'Honduran Single-Origin', 'Hazelnut Oat Flat White',
    'Caramel Macchiato', 'Double Ristretto', 'Iced Vietnamese', 'Mocha Noir',
    'Turmeric Gold Latte', 'Maple Pecan Latte', 'Classic Americano', 'Nitro Cold Brew',
    'Lavender Honey Latte', 'Espresso Tonic', 'Pistachio Cortado', 'Smoked Cinnamon Mocha',
];

const BREAKFAST_NAMES = [
    'Truffle Shakshuka', 'Burnt Honey Pancakes', 'Avocado & Smoked Salmon Toast', 'Garlic Confit Toast',
    'Wild Mushroom Omelette', 'Honey Pear Granola', 'Brioche French Toast', 'Smashed Pea & Feta Toast',
    'Chorizo Hash', 'Baked Ricotta & Fig', 'Breakfast Burrito', 'Classic Eggs Benedict',
    'Buckwheat Crêpes', 'Herbed Shakshuka', 'Maple Bacon Waffles', 'Smoked Trout Bagel',
    'Golden Beet Toast', 'Spiced Chai Oats', 'Sourdough Breakfast Board', 'Lemon Ricotta Pancakes',
];

const MAINS_NAMES = [
    'Pan-Seared Duck Breast', 'Saffron Risotto', 'Charred Sea Bass', 'Dry-Aged Ribeye',
    'Wood-Fired Half Chicken', 'Braised Lamb Shank', 'Short Rib Pappardelle', 'Miso-Glazed Salmon',
    'Porcini Tagliatelle', 'Herb-Crusted Rack of Lamb', 'Seared Scallops', 'Truffle Mushroom Gnocchi',
    'Grilled Octopus', 'Black Garlic Tenderloin', 'Roasted Half Lobster', 'Harissa-Spiced Cauliflower',
    'Smoked Brisket Plate', 'Pan-Roasted Halibut', 'Confit Duck Leg', 'Wild Mushroom Wellington',
];

const DESSERTS_NAMES = [
    'Dark Chocolate Fondant', 'Fig & Mascarpone Tart', 'Espresso Tiramisu', 'Burnt Basque Cheesecake',
    'Orange Chocolate Ganache', 'Caramelized Pear Tart', 'Salted Caramel Profiteroles', 'Pistachio Panna Cotta',
    'Lemon Olive Oil Cake', 'Hazelnut Praline Mousse', 'Vanilla Bean Crème Brûlée', 'Roasted Peach Galette',
    'Dark Cherry Clafoutis', 'Honey Lavender Sorbet', 'Spiced Apple Tarte Tatin', 'Matcha White Chocolate Tart',
    'Toasted Coconut Mousse', 'Caramel Walnut Brownie', 'Berry Mille-Feuille', 'Cardamom Rice Pudding',
];

export const MENU_ITEMS = [
    ...buildItems('Coffee', COFFEE_NAMES),
    ...buildItems('Breakfast', BREAKFAST_NAMES),
    ...buildItems('Mains', MAINS_NAMES),
    ...buildItems('Desserts', DESSERTS_NAMES),
];
