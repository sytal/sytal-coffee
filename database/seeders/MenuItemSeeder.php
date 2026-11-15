<?php

namespace Database\Seeders;

use App\Models\MenuItem;
use Illuminate\Database\Seeder;

class MenuItemSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['category' => 'Loaded Fries', 'name' => 'The KAVO Loaded', 'description' => 'Crispy fries buried under melted cheese, beef crumble, and house sauce.', 'price' => 'Rs. 650', 'image' => '/images/menu/kavo-loaded.jpg', 'tags' => ['Fan Favorite', 'Extra Cheese', 'Shareable']],
            ['category' => 'Loaded Fries', 'name' => 'Peri Peri Fries', 'description' => 'Hand-cut fries tossed in fiery peri peri spice, finished with garlic mayo.', 'price' => 'Rs. 450', 'image' => '/images/menu/peri-peri-fries.jpg', 'tags' => ['Spicy', 'Hand-Cut', 'Crowd Favorite']],
            ['category' => 'Loaded Fries', 'name' => 'Smoky BBQ Fries', 'description' => 'Loaded with smoky BBQ pulled beef, cheddar drizzle, and crispy onions.', 'price' => 'Rs. 700', 'image' => '/images/menu/smoky-bbq-fries.jpg', 'tags' => ['Smoky', 'BBQ', 'Loaded']],
            ['category' => 'Loaded Fries', 'name' => 'Classic Salted Fries', 'description' => 'Golden, crispy, and simple — the fries that started it all.', 'price' => 'Rs. 350', 'image' => '/images/menu/classic-salted-fries.jpg', 'tags' => ['Classic', 'Crispy', 'Quick Bite']],

            ['category' => 'Burgers', 'name' => 'KAVO Signature Stack', 'description' => 'Double beef patty, melted cheese, caramelized onions, house special sauce.', 'price' => 'Rs. 950', 'image' => '/images/menu/signature-stack.jpg', 'tags' => ["Chef's Pick", 'Double Patty', 'Signature']],
            ['category' => 'Burgers', 'name' => 'Smoky BBQ Burger', 'description' => 'Beef patty glazed in smoky BBQ sauce, crispy onion rings, smoked cheddar.', 'price' => 'Rs. 850', 'image' => '/images/menu/smoky-bbq-burger.jpg', 'tags' => ['BBQ', 'Smoked Cheddar', 'Onion Rings']],
            ['category' => 'Burgers', 'name' => 'Zinger Crunch Burger', 'description' => 'Crispy fried chicken fillet, spicy mayo, fresh lettuce, toasted bun.', 'price' => 'Rs. 800', 'image' => '/images/menu/zinger-crunch-burger.jpg', 'tags' => ['Crispy Chicken', 'Spicy Mayo', 'Best Seller']],
            ['category' => 'Burgers', 'name' => 'Cheese Melt Burger', 'description' => 'Single patty drenched in a triple-cheese blend — simple, messy, worth it.', 'price' => 'Rs. 700', 'image' => '/images/menu/cheese-melt-burger.jpg', 'tags' => ['Triple Cheese', 'Classic', 'Gooey']],

            ['category' => 'Shakes & Drinks', 'name' => 'Nutella Overload Shake', 'description' => 'Thick Nutella shake, whipped cream, chocolate drizzle, crushed wafers.', 'price' => 'Rs. 550', 'image' => '/images/menu/nutella-shake.jpg', 'tags' => ['Nutella', 'Thick Shake', 'Indulgent']],
            ['category' => 'Shakes & Drinks', 'name' => 'Oreo Blast', 'description' => 'Crushed Oreos blended into a creamy vanilla base, topped with cookie crumbs.', 'price' => 'Rs. 500', 'image' => '/images/menu/oreo-blast.jpg', 'tags' => ['Oreo', 'Creamy', 'Crowd Favorite']],
            ['category' => 'Shakes & Drinks', 'name' => 'Classic Lemonade', 'description' => 'Fresh-squeezed lemonade, mint, and a hint of soda for the fizz.', 'price' => 'Rs. 350', 'image' => '/images/menu/lemonade.jpg', 'tags' => ['Fresh', 'Minty', 'Refreshing']],
            ['category' => 'Shakes & Drinks', 'name' => 'Iced Mocha Freeze', 'description' => 'Blended cold coffee, chocolate syrup, and a cloud of whipped cream.', 'price' => 'Rs. 480', 'image' => '/images/menu/iced-mocha.jpg', 'tags' => ['Cold Coffee', 'Chocolate', 'Blended']],

            ['category' => 'Desserts', 'name' => 'Molten Chocolate Brownie', 'description' => 'Warm chocolate brownie, molten center, vanilla ice cream, chocolate drizzle.', 'price' => 'Rs. 480', 'image' => '/images/menu/molten-brownie.jpg', 'tags' => ['KAVO Classic', 'Molten Center', 'Warm']],
            ['category' => 'Desserts', 'name' => 'Nutella Waffle', 'description' => 'Crisp waffle loaded with Nutella, banana slices, and powdered sugar.', 'price' => 'Rs. 550', 'image' => '/images/menu/nutella-waffle.jpg', 'tags' => ['Nutella', 'Crisp', 'Shareable']],
            ['category' => 'Desserts', 'name' => 'Churros & Dip', 'description' => 'Crispy cinnamon-sugar churros served with warm chocolate dip.', 'price' => 'Rs. 450', 'image' => '/images/menu/churros.jpg', 'tags' => ['Crispy', 'Cinnamon Sugar', 'Dippable']],
        ];

        foreach ($items as $index => $item) {
            MenuItem::create($item + ['sort_order' => $index]);
        }
    }
}
