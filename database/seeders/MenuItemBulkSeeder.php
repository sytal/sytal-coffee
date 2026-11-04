<?php

namespace Database\Seeders;

use App\Models\MenuItem;
use Illuminate\Database\Seeder;

// One-off bulk-fill so every category has a believable menu depth (15-25
// items) instead of 3-4. Run once via `php artisan db:seed --class=MenuItemBulkSeeder`;
// safe to re-run since it skips names that already exist.
class MenuItemBulkSeeder extends Seeder
{
    private const IMAGES = [
        '/images/menu/bread-barrel.jpg',
        '/images/menu/caesar.jpg',
        '/images/menu/cake.jpg',
        '/images/menu/greek-salad.jpg',
        '/images/menu/lobster-bisque.jpg',
        '/images/menu/lobster-roll.jpg',
        '/images/menu/mozzarella.jpg',
        '/images/menu/spinach-salad.jpg',
        '/images/menu/tuscan-grilled.jpg',
    ];

    public function run(): void
    {
        $items = [
            'Loaded Fries' => [
                ['Classic Cheese Fries', 'Crispy fries smothered in melted cheddar.', 400],
                ['Zinger Loaded Fries', 'Fries topped with crispy zinger strips and mayo drizzle.', 600],
                ['Nacho Cheese Fries', 'Loaded with nacho cheese sauce and jalapenos.', 550],
                ['Garlic Parmesan Fries', 'Tossed in garlic butter and shaved parmesan.', 480],
                ['Chipotle Mayo Fries', 'Smoky chipotle mayo drizzled over crispy fries.', 500],
                ['Mexican Loaded Fries', 'Salsa, cheese, jalapenos, and sour cream.', 650],
                ['Beef Loaded Fries', 'Seasoned beef mince, cheese sauce, and onions.', 750],
                ['Chicken Tikka Fries', 'Spiced chicken tikka chunks over cheesy fries.', 700],
                ['Truffle Fries', 'Finished with truffle oil and parmesan.', 600],
                ['Masala Fries', 'Classic fries tossed in tangy masala seasoning.', 350],
                ['Honey Mustard Fries', 'Crispy fries with a sweet honey-mustard glaze.', 450],
                ['Buffalo Chicken Fries', 'Buffalo-sauced chicken bits with ranch drizzle.', 700],
                ['Cheese & Jalapeno Fries', 'Melted cheese with a spicy jalapeno kick.', 500],
                ['Loaded Poutine Fries', 'Cheese curds and savory gravy, Canadian style.', 650],
                ['Spicy Peri Peri Fries', 'Fries tossed in fiery peri peri spice mix.', 450],
                ['BBQ Pulled Chicken Fries', 'Smoky BBQ pulled chicken over loaded fries.', 750],
                ['Sweet Chili Fries', 'Crispy fries drizzled with sweet chili sauce.', 400],
                ['Loaded Supreme Fries', 'Everything-on-top: cheese, beef, jalapenos, sauces.', 850],
                ['Curly Fries Deluxe', 'Seasoned curly fries with dip of your choice.', 420],
                ['Waffle Fries Special', 'Crispy waffle-cut fries with cheese sauce.', 500],
            ],
            'Burgers' => [
                ['Classic Beef Burger', 'Juicy beef patty with lettuce, tomato, and cheese.', 650],
                ['Smoky BBQ Burger', 'Beef patty glazed in smoky BBQ sauce.', 750],
                ['Zinger Burger', 'Crispy fried chicken fillet with spicy mayo.', 600],
                ['Grilled Chicken Burger', 'Char-grilled chicken breast with fresh greens.', 580],
                ['Double Cheese Burger', 'Two beef patties stacked with double cheese.', 950],
                ['Mushroom Swiss Burger', 'Sauteed mushrooms and melted swiss cheese.', 700],
                ['Spicy Jalapeno Burger', 'Beef patty with jalapenos and pepper jack cheese.', 700],
                ['Crispy Chicken Burger', 'Breaded chicken fillet with coleslaw and mayo.', 580],
                ['Bacon Cheese Burger', 'Crispy bacon strips with melted cheddar.', 800],
                ['Fish Fillet Burger', 'Crispy battered fish fillet with tartar sauce.', 620],
                ['Veggie Supreme Burger', 'Grilled vegetable patty with special sauce.', 500],
                ['Peri Peri Chicken Burger', 'Flame-grilled peri peri chicken breast.', 650],
                ['BBQ Bacon Beef Burger', 'Beef, bacon, and smoky BBQ sauce combo.', 850],
                ['Mega Stack Burger', 'Triple-stacked beef patties for big appetites.', 1100],
                ['Honey Mustard Chicken Burger', 'Crispy chicken with honey mustard glaze.', 600],
                ['Cheesy Beef Slider (2pc)', 'Two mini beef sliders with melted cheese.', 550],
                ['Spicy Zinger Deluxe', 'Extra spicy zinger fillet with jalapeno mayo.', 650],
                ['Tandoori Chicken Burger', 'Tandoori-spiced chicken with mint yogurt sauce.', 620],
                ['Classic Chicken Burger', 'Simple grilled chicken breast with lettuce.', 500],
                ['Ultimate Beef Deluxe', 'Beef patty, bacon, cheese, and fried onions.', 900],
            ],
            'Desserts' => [
                ['Chocolate Lava Cake', 'Warm cake with a gooey molten chocolate center.', 450],
                ['New York Cheesecake', 'Classic creamy baked cheesecake slice.', 500],
                ['Brownie Sundae', 'Fudge brownie topped with vanilla ice cream.', 480],
                ['Tiramisu Cup', 'Coffee-soaked layers with mascarpone cream.', 420],
                ['Red Velvet Cake Slice', 'Moist red velvet with cream cheese frosting.', 450],
                ['Churros with Chocolate Dip', 'Crispy cinnamon churros with warm chocolate sauce.', 400],
                ['Nutella Waffle', 'Belgian waffle drizzled with Nutella and nuts.', 480],
                ['Caramel Pudding', 'Silky caramel custard pudding.', 350],
                ['Oreo Cheesecake', 'Cheesecake loaded with crushed Oreo cookies.', 500],
                ['Fruit Tart', 'Buttery tart shell with custard and fresh fruit.', 450],
                ['Apple Pie Slice', 'Warm cinnamon apple pie with a flaky crust.', 420],
                ['Chocolate Chip Cookie Skillet', 'Warm skillet cookie with ice cream.', 500],
                ['Baklava Platter', 'Layers of filo pastry, nuts, and honey syrup.', 400],
                ['Molten Nutella Cake', 'Chocolate cake with a warm Nutella core.', 480],
                ['Strawberry Shortcake', 'Fluffy sponge cake with strawberries and cream.', 450],
                ['Banoffee Pie Slice', 'Banana, toffee, and whipped cream pie.', 440],
                ['Mango Mousse Cup', 'Light mango mousse with a biscuit base.', 400],
                ['Pistachio Kunafa', 'Crispy kunafa with pistachio and sugar syrup.', 500],
                ['Chocolate Fudge Brownie', 'Dense fudgy brownie square.', 350],
                ['Vanilla Panna Cotta', 'Silky vanilla panna cotta with berry compote.', 420],
            ],
            'Shakes & Drinks' => [
                ['Oreo Milkshake', 'Creamy vanilla shake blended with Oreo cookies.', 450],
                ['Nutella Milkshake', 'Rich chocolate-hazelnut milkshake.', 480],
                ['Classic Vanilla Shake', 'Smooth and creamy vanilla milkshake.', 400],
                ['Chocolate Fudge Shake', 'Thick chocolate shake with fudge swirl.', 450],
                ['Strawberry Shake', 'Fresh strawberry blended milkshake.', 420],
                ['Mango Lassi', 'Traditional yogurt-based mango lassi.', 350],
                ['Peach Iced Tea', 'Refreshing chilled peach-flavored iced tea.', 300],
                ['Lemon Mint Cooler', 'Zesty lemon and fresh mint refresher.', 280,],
                ['Caramel Frappe', 'Blended iced coffee with caramel drizzle.', 480],
                ['Cold Coffee', 'Classic chilled coffee blended with ice cream.', 420],
                ['Blue Lagoon Mocktail', 'Tropical blue citrus mocktail.', 380],
                ['Virgin Pina Colada', 'Coconut and pineapple blended mocktail.', 400],
                ['Watermelon Cooler', 'Fresh watermelon juice over ice.', 320,],
                ['Pineapple Fizz', 'Sparkling pineapple and soda mocktail.', 350],
                ['Cookies & Cream Shake', 'Vanilla shake loaded with cookie crumbs.', 460],
                ['Pistachio Milkshake', 'Creamy shake blended with real pistachios.', 500],
                ['Classic Soft Drink', 'Chilled Coke, Sprite, or Fanta.', 150],
                ['Fresh Lime Soda', 'Sweet or salted fresh lime soda.', 200],
                ['Iced Latte', 'Smooth espresso over milk and ice.', 420],
                ['Hot Chocolate', 'Rich and creamy hot chocolate.', 380],
            ],
            'Ice Cream' => [
                ['Vanilla Scoop', 'Classic creamy vanilla bean ice cream.', 250],
                ['Chocolate Fudge Scoop', 'Rich chocolate ice cream with fudge ribbons.', 280],
                ['Strawberry Swirl Scoop', 'Fresh strawberry ice cream with fruit swirls.', 280],
                ['Pistachio Scoop', 'Real pistachio ice cream with nut pieces.', 320],
                ['Cookies & Cream Sundae', 'Cookies and cream scoops with chocolate sauce.', 450],
                ['Caramel Sundae', 'Vanilla scoops drizzled with warm caramel.', 450],
                ['Chocolate Brownie Sundae', 'Ice cream over warm brownie chunks.', 480],
                ['Mango Sorbet', 'Refreshing dairy-free mango sorbet.', 300],
                ['Banana Split', 'Classic banana split with three ice cream flavors.', 550],
                ['Hot Fudge Sundae', 'Vanilla ice cream smothered in hot fudge.', 420],
                ['Mint Choc Chip Scoop', 'Cool mint ice cream with chocolate chips.', 300],
                ['Butterscotch Scoop', 'Creamy butterscotch ice cream with nut crunch.', 300],
                ['Oreo Ice Cream Sandwich', 'Ice cream sandwiched between Oreo cookies.', 350],
                ['Belgian Waffle & Ice Cream', 'Warm waffle topped with two ice cream scoops.', 600],
                ['Chocolate Lava Sundae', 'Warm molten cake with vanilla ice cream.', 550],
                ['Rocky Road Scoop', 'Chocolate ice cream with marshmallow and nuts.', 320],
                ['Classic Kulfi', 'Traditional dense milk-based kulfi.', 250],
                ['Mango Kulfi', 'Kulfi infused with real mango pulp.', 280],
                ['Ice Cream Float', 'Vanilla scoop floating in chilled soft drink.', 350],
                ['Triple Scoop Platter', 'Choice of any three flavors, your way.', 500],
            ],
        ];

        $imgIndex = 0;
        foreach ($items as $category => $list) {
            foreach ($list as $i => [$name, $description, $price]) {
                if (MenuItem::where('name', $name)->exists()) {
                    continue;
                }
                MenuItem::create([
                    'name' => $name,
                    'category' => $category,
                    'description' => $description,
                    'price' => 'Rs. '.$price,
                    'image' => self::IMAGES[$imgIndex % count(self::IMAGES)],
                    'tags' => [],
                    'sort_order' => $i,
                    'is_available' => true,
                ]);
                $imgIndex++;
            }
        }
    }
}
