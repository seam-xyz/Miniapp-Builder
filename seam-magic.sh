echo "'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''',,,,,'''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''',;;;;;;:;''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''',;::,''''',::'''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''',;:;''''''''';c,''''''''''''''''''
.......''''''''.''''...'..''..',;:::;;,,cl;''.''.'...';:,'''''''......'''..
'''''''''''...'''''.''..'''';oOKXNNXXKKKNXd''''..''.'';:,''''''''''''.'''''
.................'......'.,dKWMMMWWWWMMMMWKc.'.....,;,cc'.'...'........''..
.........................,xNMMMMKdooddONMMWx,....,;:lodl;,'................
.........................cXMMMMNx::,..,oXWWKc....':oxkkdc;'................
.........................oNMMWWKd;'....'c0WNd'...';:oxoc;,'................
.........................lNMWW0kOkc,.....;ll;......,l:,,'..................
.........................;OWW0xKWWN0doc,...........;:'.....................
..........................:kOxKWMMMMMWN0dc'.......,:,......................
...........................:lkNWMMMMMMMMMNOc'....,:;.......................
.........................';c,,lkNWMMMMMMMMMNx,..':;........................
.........................;c,...':d0WWWWMMWMWWO;':;.........................
........................,c,.......,oKWWMMMMMMWkc;..........................
.......................,c;..........;lOWMMMMMMXl...........................
......................'::':o:.........;0MMMMMMXl...........................
......................;c';0WXo........'xMMMMMMXc...........................
.....................'c:.,OWWNd'......,kMWWMWWO,...........................
.....................;c'..oNMMNk:...,;dNMWWWWXc............................
....................'c:...;KMMMWN0xkKNWMMMMWKc.............................
....................,c;...'xWMMWWMMMWWMMMWKd;..............................
....................;c,....;dxolldO0Okkxoc,................................
....................;c,.........';:,'......................................
''''''''''''''''..'.,c;''''''',::;'.''..''''''''.'''''''''.'''.''''''''''''
''''''''''''''''''''':c;,,,;;:;,'''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''',;::;:;,,'''''''''''''''''''''''''''''''''''''''''''''
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,;;,,,,,,,;;,,,,;,,;;,,,,,,,;;,,,,,,,,,,,,,,,,,;;,,,,,,,,;,,,,,,,;,,,,,,
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;                                   
"
echo "Welcome to the Seam Miniapp Builder! Let's create a new miniapp together."
echo "[1/3] What's your Seam username? "
read -r username

echo "[2/3] What should your app be called?"
read -r name

# Extract the first word from the input
shortName=$(echo $name | awk '{print $1}')

echo "[3/3] What's the description of your app?"
read -r description

echo "Awesome! Sewing your $name app together..."

# Add the new block to the types dictionary
output="src/blocks/types.tsx"
echo "$OSTYPE"
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sed -i -e '$ d' $output
elif [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' -e '$ d' $output
else
        sed -i -e '$ d' $output
fi

echo "  \"$shortName\": { 
    type: \"$shortName\",
    displayName: \"$name\",
    displayDescription: \"$description\",
    emptyTitle: \"Empty $name App\",
    emptySubtitle: \"Tap here to setup your $name app!\",
    icon: \"${shortName}Icon\", // TODO: insert your app icon here
    deprecated: false,
    doesBlockPost: true,
    doesBlockEdit: true,
    createdBy: \"$username\",
    fullscreenEdit: false,
},
};" >> $output
echo "✅ Added $name to types.tsx"

# Create a template file for the new block
newBlock="src/blocks/${shortName}App.tsx"
cp "src/blocks/BlockTemplate.txt" $newBlock


if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/%NAME%/${shortName}/g" $newBlock
        echo "✅ Created ${shortName}App.tsx for your new block"
else
        sed -i "s/%NAME%/${shortName}/g" $newBlock
        echo "✅ Created ${shortName}App.tsx for your new block"
fi

# Add the new block to the block factory
placeholder="\/\/ new blocks go here"
importBlock="import ${shortName}App from \'./${shortName}App\'
"
newBlockCase="case \"$shortName\": return new ${shortName}App(model, theme)\\n      $placeholder"

if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/${placeholder}/${newBlockCase}/g" "src/blocks/BlockFactory.tsx"
        sed -i '' '1i\
'"$importBlock"'
' "src/blocks/BlockFactory.tsx"
else
        sed -i "s/${placeholder}/${newBlockCase}/g" "src/blocks/BlockFactory.tsx"
        sed -i '1i\
'"$importBlock"'
' "src/blocks/BlockFactory.tsx"
fi

echo "✅ Added ${name} to the BlockFactory.tsx"

echo "

█████╗ ██████╗ ██████╗     ██████╗ ███████╗ █████╗ ██████╗ ██╗   ██╗██╗
██╔══██╗██╔══██╗██╔══██╗    ██╔══██╗██╔════╝██╔══██╗██╔══██╗╚██╗ ██╔╝██║
███████║██████╔╝██████╔╝    ██████╔╝█████╗  ███████║██║  ██║ ╚████╔╝ ██║
██╔══██║██╔═══╝ ██╔═══╝     ██╔══██╗██╔══╝  ██╔══██║██║  ██║  ╚██╔╝  ╚═╝
██║  ██║██║     ██║         ██║  ██║███████╗██║  ██║██████╔╝   ██║   ██╗
╚═╝  ╚═╝╚═╝     ╚═╝         ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝    ╚═╝   ╚═╝
"

if [[ "$OSTYPE" == "darwin"* ]]; then
        open $newBlock
fi
echo "When you're ready, run yarn start to see your block in action!"
