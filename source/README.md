# Editable sources

The public work folders contain the deployed HTML and all paintings in art/.
Each HTML is directly editable. The original Westlake work keeps its CSS and JavaScript inside its HTML.

The two source folders also retain the scene definitions, canonical complete text,
shared CSS and JavaScript used to build the other seven works. They read the same
public art files, so images are stored only once in this download.

From the repository root, use Node.js without npm packages:

    node source/literary-pages/build.cjs
    node source/new-classics/build.cjs

The first command rebuilds 岳阳楼记 and 醉翁亭记. The second rebuilds the five
new works. Neither changes the collection or the original Westlake page.
The new builder can also accept one or more work slugs as arguments.
If you change a scene id or its order, update its numbered art filename accordingly.

The five new works follow complete common texts with modern punctuation.
小石潭记 uses 珮环 and 日光下澈; 滕王阁序 uses 豫章故郡, 君子见机,
即冈峦之体势, and includes the concluding eight-line 滕王阁诗.
Author-writing scenes are literary interpretations, not documentary reconstructions.

天净沙·秋思 uses the complete common five-line text by 马致远. Its six
paintings split 古道西风 / 瘦马 into a road scene and a clickable close-up,
then end with an imagined scene of the poet writing. The complete poem is
checked against qiusi.txt whenever the source builder runs.
