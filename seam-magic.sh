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

sed -i '' -e '$ d' $output
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
sed -i '' "s/%NAME%/${name}/g" $newBlock
echo "✅ Created ${name}Block.tsx for your new block"

# Add the new block to the block factory
placeholder="\/\/ new blocks go here"
placeholderImport="import GiphyBlock from './GiphyBlock"
importBlock="import ${name}Block from .\/${name}Block"
newBlockCase="case \"$name\": return new ${name}Block(model)\n      $placeholder"
sed -i '' "s/${placeholder}/${newBlockCase}/g" "src/blocks/BlockFactory.tsx"
#sed -i'.tsx' "1i\ $importBlock" "src/blocks/BlockFactory.tsx"
echo "✅ Added ${name} to the BlockFactory.tsx"