echo "Welcome to the Seam Block Editor! Let's make some Seam Magic and create a new block together."
echo "                                ./(,                                      
                                     *#%%%(                                     
                                     /%%%%(.                                    
                                    .(%%%%#,                                    
             .                      ,#%%%%%/                      .             
           *%%%%#.                  *%%%%%%(.                 .(%%%%/           
            /%%%%%%#*              .(%%%%%%#,              ,(#%%%%%(.           
             ./#%%%%%%#*           ,#%%%%%%%*           ,#%%%%%%%(.             
                (%%%%%%%%#/.       *%%%%%%%%/.      .*#%%%%%%%%(.               
                 .(%%%%%%%%%#(,   .(%%%%%%%%#,   .*#%%%%%%%%%#.                 
                   .(%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#,                   
                     .(%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#,                     
                       .#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#,                       
                        .%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*                        
            ...,,**//(#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#(//**,,...            
 /#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#/.
,%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%/
    ...,,*/(##%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#(//*,...    
                       .(%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%(,                       
                        ,%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%/                        
                      .(%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%,                      
                    .(%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#,                    
                  .(%%%%%%%%%%#*../%%%%%%%%%%(,..#%%%%%%%%%%#,                  
                 (%%%%%%%%%(,      /%%%%%%%%(.     ./#%%%%%%%%#.                
              .(%%%%%%%%(,         ,#%%%%%%%/         ./#%%%%%%%#,              
            ./#%%%%%#/.            .(%%%%%%#,             *#%%%%%%(.            
           *%%%%%#/                 /%%%%%%(.                *#%%%%%/           
            *##,                    *#%%%%%/                    .##(.           
                                    ,(%%%%#*                                    
                                     (%%%%#.                                    
                                     *#%%%(                                     
                                     .(%%#,                                     
"

echo "[1/4] What should your block be called? : "
read -r name

echo "[2/4] What's the short description of your block? : "
read -r description

echo "[3/4] What should the title be when the block is empty? (Empty Title) : "
read -r emptyTitle

echo "[4/4] What should the description be when the block is empty? : "
read -r emptyDescription

echo "Awesome! Sewing your $name block together..."

# Add the new block to the types dictionary
output="src/blocks/types.tsx"

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sed -i -e '$ d' $output
elif [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' -e '$ d' $output
else
        echo "❌ Unable to create ${name}Block -- unsupported operating system."
        exit 1
fi

echo "  \"$name\": { 
        type: \"$name\",
        displayName: \"$name\",
        displayDescription: \"$description\",
        emptyTitle: \"$emptyTitle\",
        emptySubtitle: \"$emptyDescription\",
        icon: ${name}Icon,
        deprecated: false
    },
};" >> $output
echo "✅ Added $name to types.tsx"

# Create a template file for the new block
newBlock="src/blocks/${name}Block.tsx"
cp "src/blocks/BlockTemplate.txt" $newBlock


if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sed -i "s/%NAME%/${name}/g" $newBlockt
        echo "✅ Created ${name}Block.tsx for your new block"
elif [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/%NAME%/${name}/g" $newBlock
        echo "✅ Created ${name}Block.tsx for your new block"
fi

# Add the new block to the block factory
placeholder="\/\/ new blocks go here"
placeholderImport="import GiphyBlock from './GiphyBlock"
importBlock="import ${name}Block from .\/${name}Block"
newBlockCase="case \"$name\": return new ${name}Block(model)\n      $placeholder"

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sed -i "s/${placeholder}/${newBlockCase}/g" "src/blocks/BlockFactory.tsx"
elif [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/${placeholder}/${newBlockCase}/g" "src/blocks/BlockFactory.tsx"
fi

#sed -i'.tsx' "1i\ $importBlock" "src/blocks/BlockFactory.tsx"
echo "✅ Added ${name} to the BlockFactory.tsx"

# Use your custom block as default in App.tsx
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sed -i '' "s/%NAME%/${name}/g" "src/App.tsx"
elif [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i "s/%NAME%/${name}/g" "src/App.tsx"
fi
echo "✅ Using your ${name} block as default in App.tsx"

echo "

██████╗░██╗░░░░░░█████╗░░█████╗░██╗░░██╗  ░█████╗░██████╗░███████╗░█████╗░████████╗███████╗██████╗░██╗
██╔══██╗██║░░░░░██╔══██╗██╔══██╗██║░██╔╝  ██╔══██╗██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██╔════╝██╔══██╗██║
██████╦╝██║░░░░░██║░░██║██║░░╚═╝█████═╝░  ██║░░╚═╝██████╔╝█████╗░░███████║░░░██║░░░█████╗░░██║░░██║██║
██╔══██╗██║░░░░░██║░░██║██║░░██╗██╔═██╗░  ██║░░██╗██╔══██╗██╔══╝░░██╔══██║░░░██║░░░██╔══╝░░██║░░██║╚═╝
██████╦╝███████╗╚█████╔╝╚█████╔╝██║░╚██╗  ╚█████╔╝██║░░██║███████╗██║░░██║░░░██║░░░███████╗██████╔╝██╗
╚═════╝░╚══════╝░╚════╝░░╚════╝░╚═╝░░╚═╝  ░╚════╝░╚═╝░░╚═╝╚══════╝╚═╝░░╚═╝░░░╚═╝░░░╚══════╝╚═════╝░╚═╝
"

open $newBlock