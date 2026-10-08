const books = [
  { slug: 'shi-hao-li', title: '石壕吏', author: '杜甫', source: 'shihao.txt', seal: '夜', prefix: 'shi',
    scenes: [
      { id: 'village', label: '暮投石壕村', dark: true, paragraphs: ['暮投石壕村，<br>有吏夜捉人。'], alt: '寒夜中的石壕村，差吏持灯走近土屋，一位旅人晚投村中。', weather: [.98,0,.06], fire: [.65,.57], portal: {to:'escape',point:[.65,.57],label:'点击夜色中的灯火，走近农家'} },
      { id: 'escape', label: '老妇出门看', dark: true, paragraphs: ['老翁逾墙走，<br>老妇出门看。'], alt: '老人翻过低矮的土墙，老妇迎着门外灯光走出，家人藏在暗处。' },
      { id: 'voices', label: '吏呼一何怒', dark: true, paragraphs: ['吏呼一何怒！<br>妇啼一何苦！'], alt: '门外差吏厉声催问，老妇在微光中诉说，夜风吹动粗布衣袖。' },
      { id: 'letter', label: '三男邺城戍', dark: true, paragraphs: ['听妇前致词，三男邺城戍。', '一男附书至，二男新战死。'], alt: '老妇在昏暗屋内捧着儿子的旧家书，桌旁三个空碗照见一家人的离散。', fire:[.70,.65],weather:[.98,0,.07],portal:{to:'hands',point:[.65,.68],label:'点击家书，走近老妇的双手'} },
      { id: 'hands', label: '死者长已矣', dark: true, paragraphs: ['存者且偷生，<br><span class="spoken">死者长已矣！</span>'], alt: '老妇饱经劳作的双手护住旧信，灯光落在粗布和皱纹上，悲痛无声。' },
      { id: 'family', label: '惟有乳下孙', dark: true, paragraphs: ['室中更无人，惟有乳下孙。', '有孙母未去，出入无完裙。'], alt: '贫寒屋内，儿媳穿着缝补的整身衣衫抱紧熟睡的婴儿，身边是将熄的炉火。', fire:[.60,.75],weather:[.98,0,.09],portal:{to:'volunteer',point:[.60,.75],label:'点击屋内的微火，回到老妇的抉择'} },
      { id: 'volunteer', label: '请从吏夜归', dark: true, paragraphs: ['老妪力虽衰，<br>请从吏夜归。'], alt: '老妇披上旧衣，在自家门槛前站定，面对远处催促的差吏，神色沉静。' },
      { id: 'hearth', label: '犹得备晨炊', dark: true, paragraphs: ['急应河阳役，<br>犹得备晨炊。'], alt: '一口旧陶锅、一把木勺和微弱余火，老妇的手伸向灶边，晨炊成为她的请求。',fire:[.64,.72],weather:[.98,0,.12],portal:{to:'silence',point:[.64,.72],label:'点击灶中余火，进入夜深后的寂静'} },
      { id: 'silence', label: '如闻泣幽咽', dark: true, paragraphs: ['夜久语声绝，<br>如闻泣幽咽。'], alt: '人去后的院落只余空门与残灯，远处背影渐隐，屋内传来压低的哭声。',fire:[.66,.62],weather:[.98,0,.06],portal:{to:'writing',point:[.66,.62],label:'点击残灯，进入杜甫记下这一夜时的心境'} },
      { id: 'writing', label: '独与老翁别', dark: true, paragraphs: ['天明登前途，<br><span class="spoken">独与老翁别。</span>'], alt: '想象中的杜甫伏在朴素案前执笔，窗外的晨路上只余一位老翁，离别与夜色沉在纸边。',fire:[.50,.70],weather:[.98,0,.05],distance:2.2 }
    ]
  },
  { slug:'mao-wu-wei-qiu-feng-suo-po-ge',title:'茅屋为秋风所破歌',author:'杜甫',source:'maowu.txt',seal:'庐',prefix:'mao',
    scenes:[
      {id:'wind',label:'卷我屋上三重茅',mobile:'84% 50%',camera:[1.025,1.085],paragraphs:['八月秋高风怒号，<br>卷我屋上三重茅。'],alt:'秋风卷起成都草堂的屋茅，竹树摇动，一间小屋暴露在灰蓝天色下。',weather:[.98,-.35,0]},
      {id:'straw',label:'茅飞渡江',paragraphs:['茅飞渡江洒江郊，<br>高者挂罥长林梢，<br>下者飘转沉塘坳。'],alt:'飞散的茅草越过秋江，有的挂在高树枝头，有的落入低处池塘。',weather:[.53,-.25,0]},
      {id:'children',label:'抱茅入竹去',paragraphs:['南村群童欺我老无力，<br>忍能对面为盗贼。', '公然抱茅入竹去，'],alt:'几个村童抱着散落的茅草走入竹林，贫寒的诗人拄杖站在后方。',weather:[.98,-.18,0],portal:{to:'staff',point:[.67,.65],label:'点击竹径旁的木杖，走近诗人的叹息'}},
      {id:'staff',label:'归来倚杖自叹息',paragraphs:['唇焦口燥呼不得，<br>归来倚杖自叹息。'],alt:'衣衫朴素的杜甫倚在木杖上，门前茅草散落，秋风中的脸满是疲惫。'},
      {id:'clouds',label:'秋天漠漠向昏黑',dark:true,paragraphs:['俄顷风定云墨色，<br>秋天漠漠向昏黑。'],alt:'风停后墨色云层压向草堂，断裂屋檐下的一线灯光将熄未熄。',weather:[.98,.18,.06],fire:[.66,.66],portal:{to:'quilt',point:[.66,.66],label:'点击窗内的灯光，走进雨中的茅屋'}},
      {id:'quilt',label:'布衾多年冷似铁',dark:true,paragraphs:['布衾多年冷似铁，<br>娇儿恶卧踏里裂。'],alt:'孩子蜷在旧床上，盖着洗得发硬且已缝补多次的布被，床边有一盏小油灯。',weather:[.98,0,.08],fire:[.55,.70]},
      {id:'rain',label:'雨脚如麻未断绝',dark:true,paragraphs:['床头屋漏无干处，<br>雨脚如麻未断绝。'],alt:'雨水从破损屋顶淌入，陶盆中的水纹不断扩大，床与书案都被湿气包围。',weather:[.76,.6,.05],fire:[.73,.62],portal:{to:'wakeful',point:[.62,.72],label:'点击接雨的陶盆，进入彻夜难眠的近景'}},
      {id:'wakeful',label:'长夜沾湿何由彻',dark:true,paragraphs:['自经丧乱少睡眠，<br>长夜沾湿何由彻！'],alt:'杜甫在雨漏的屋内裹衣独坐，孩子在身后熟睡，灯下双眼未合。',weather:[.98,.12,.05],fire:[.51,.69]},
      {id:'shelter',label:'大庇天下寒士俱欢颜',paragraphs:['<span class="spoken">安得广厦千万间，<br>大庇天下寒士俱欢颜！</span>', '风雨不动安如山。'],alt:'诗人的想象里，层层坚实屋宇庇护着平凡人家，雨幕之外的窗中透出温暖安定的灯火。',weather:[.98,.16,.04],fire:[.67,.67],portal:{to:'writing',point:[.67,.67],label:'点击庇护众人的窗灯，回到杜甫执笔的茅屋'}},
      {id:'writing',label:'吾庐独破受冻死亦足',dark:true,dense:true,paragraphs:['呜呼！', '何时眼前突兀见此屋，<br><span class="spoken">吾庐独破受冻死亦足！</span>'],alt:'想象中的杜甫在破屋灯下执笔，湿衣仍未干，目光越过自身的困苦望向远方人家。',fire:[.50,.69],weather:[.98,0,.06],distance:2.2}
    ]
  },
  {slug:'xiao-shi-tan-ji',title:'小石潭记',author:'柳宗元',source:'xiaoshitan.txt',seal:'潭',prefix:'xiao',
    scenes:[
      {id:'bamboo',label:'隔篁竹，闻水声',mobile:'88% 50%',paragraphs:['从小丘西行百二十步，<br>隔篁竹，闻水声，<br>如鸣珮环，心乐之。'],alt:'幽深竹林中小路蜿蜒，诗人驻足听见岩石后传来的清泉声。',weather:[.98,-.16,0]},
      {id:'pool',label:'下见小潭',paragraphs:['伐竹取道，下见小潭，<br><span class="spoken">水尤清冽。</span>'],alt:'竹林之间露出一湾清澈石潭，水色透亮，青苔与藤蔓沿岸生长。',weather:[.48,-.09,0],portal:{to:'stone',point:[.65,.67],label:'点击潭中水光，走近完整的石底'}},
      {id:'stone',label:'全石以为底',paragraphs:['全石以为底，近岸，卷石底以出，<br>为坻，为屿，为嵁，为岩。'],alt:'清水覆盖一整片盘曲石底，石脊翻出水面，形成小屿与参差岩岸。',weather:[.37,0,0]},
      {id:'vines',label:'青树翠蔓',paragraphs:['青树翠蔓，蒙络摇缀，<br>参差披拂。'],alt:'潭边青树与碧绿藤蔓交织垂落，水上的叶影被微风轻轻摇散。',weather:[.61,-.23,0],portal:{to:'fish',point:[.64,.65],label:'点击垂入潭中的藤影，探看水下游鱼'}},
      {id:'fish',label:'皆若空游无所依',paragraphs:['潭中鱼可百许头，<br><span class="spoken">皆若空游无所依。</span>', '日光下澈，影布石上。'],alt:'游鱼悬在透明潭水中，日光直落石底，每条鱼的影子都清楚可见。',weather:[.20,0,0],portal:{to:'darting',point:[.64,.62],label:'点击清水中的游鱼，走近它们的倏忽往来'}},
      {id:'darting',label:'似与游者相乐',paragraphs:['佁然不动，俶尔远逝，<br>往来翕忽，似与游者相乐。'],alt:'几尾小鱼从静止中忽然游散，细小水纹滑过浅石与落叶。',weather:[.15,0,0]},
      {id:'stream',label:'斗折蛇行',paragraphs:['潭西南而望，斗折蛇行，明灭可见。', '其岸势犬牙差互，不可知其源。'],alt:'潭水向西南流出，在交错岩岸与竹影之间曲折隐现，尽头没入山林。',weather:[.55,-.08,0]},
      {id:'stillness',label:'凄神寒骨',dark:true,paragraphs:['坐潭上，四面竹树环合，<br>寂寥无人，凄神寒骨，<br><span class="spoken">悄怆幽邃。</span>'],alt:'竹树围合的冷青色潭边，柳宗元独坐石上，清亮山水渐渐转为幽寂。',weather:[.62,-.09,0]},
      {id:'leaving',label:'乃记之而去',paragraphs:['以其境过清，不可久居，<br>乃记之而去。'],alt:'旅人收起书卷沿竹径离去，身后小潭只剩清水与无人的石岸。',weather:[.74,-.12,0],portal:{to:'writing',point:[.66,.64],label:'点击旅人手中的书卷，进入柳宗元记游时的心境'}},
      {id:'writing',label:'记同游者',dark:true,dense:true,paragraphs:['同游者：吴武陵，龚古，<br>余弟宗玄。', '隶而从者，崔氏二小生：<br>曰恕己，曰奉壹。'],alt:'想象中的柳宗元灯下记游，案边书卷尚未收起，窗外竹影与清潭余光伴着孤独。',fire:[.51,.68],weather:[.98,0,.07],distance:2.2}
    ]
  },
  {slug:'teng-wang-ge-xu',title:'滕王阁序',author:'王勃',source:'tengwang.txt',seal:'阁',prefix:'teng',
    scenes:[
      {id:'rivers',label:'襟三江而带五湖',mobile:'100% 50%',paragraphs:['豫章故郡，洪都新府。<br>星分翼轸，地接衡庐。', '襟三江而带五湖，<br>控蛮荆而引瓯越。'],alt:'洪州城与滕王阁临赣江而立，秋水汇入远方江湖，帆影散在晨光里。',weather:[.48,0,0]},
      {id:'treasures',label:'物华天宝，人杰地灵',paragraphs:['物华天宝，龙光射牛斗之墟；<br>人杰地灵，徐孺下陈蕃之榻。', '雄州雾列，俊采星驰。<br>台隍枕夷夏之交，<br>宾主尽东南之美。'],alt:'唐代厅堂临江敞开，典雅的琴榻、书卷与铜灯迎候宾客，江城远在门外。',weather:[.98,0,.025],fire:[.65,.68],portal:{to:'feast',point:[.65,.68],label:'点击厅堂铜灯，走入高朋满座的盛宴'}},
      {id:'feast',label:'胜友如云，高朋满座',dense:true,distance:2.35,paragraphs:['都督阎公之雅望，棨戟遥临；<br>宇文新州之懿范，襜帷暂驻。', '十旬休假，胜友如云；<br>千里逢迎，高朋满座。', '腾蛟起凤，孟学士之词宗；<br>紫电青霜，王将军之武库。'],alt:'滕王阁秋宴上官员与文士齐聚，朱柱之间湖山开阔，杯盘简雅而气度盛大。'},
      {id:'arriving',label:'时维九月，序属三秋',dense:true,distance:2.35,paragraphs:['家君作宰，路出名区；<br>童子何知，躬逢胜饯。', '时维九月，序属三秋。<br>潦水尽而寒潭清，烟光凝而暮山紫。', '俨骖騑于上路，访风景于崇阿。<br>临帝子之长洲，得天人之旧馆。'],alt:'年轻王勃沿秋水畔的古道走向高阁，暮山呈紫，岛岸露出，阁檐渐近。',weather:[.72,0,0],portal:{to:'pavilion',point:[.67,.55],label:'点击临江阁檐，走近飞阁流丹的近景'}},
      {id:'pavilion',label:'飞阁流丹',paragraphs:['层峦耸翠，上出重霄；<br>飞阁流丹，下临无地。', '鹤汀凫渚，穷岛屿之萦回；<br>桂殿兰宫，即冈峦之体势。'],alt:'朱红飞阁与层叠山峦相映，临江栏杆下岛渚迂回，水鸟栖在沙洲。',weather:[.70,0,0]},
      {id:'city',label:'舸舰弥津',paragraphs:['披绣闼，俯雕甍。<br>山原旷其盈视，川泽纡其骇瞩。', '闾阎扑地，钟鸣鼎食之家；<br>舸舰弥津，青雀黄龙之舳。'],alt:'从高阁雕窗俯视洪州，屋宇与舟船铺向江面，水道与山原展开辽阔视野。',weather:[.57,0,0]},
      {id:'sunset',label:'落霞与孤鹜齐飞',paragraphs:['云销雨霁，彩彻区明。', '<span class="spoken">落霞与孤鹜齐飞，<br>秋水共长天一色。</span>'],alt:'雨后的秋江与天光浑然一色，一只野鸭飞入灿烂落霞，近处一叶渔舟归来。',weather:[.50,0,0],portal:{to:'fishing',point:[.68,.69],label:'点击秋水中的渔舟，走近唱晚的归人'}},
      {id:'fishing',label:'渔舟唱晚',paragraphs:['渔舟唱晚，响穷彭蠡之滨；<br>雁阵惊寒，声断衡阳之浦。'],alt:'暮色里的渔舟收网归航，舟头一点暖灯，远天空有南去的雁阵。',weather:[.44,0,.06],fire:[.66,.67],portal:{to:'music',point:[.66,.67],label:'点击渔舟灯火，回到阁中清风与弦歌'}},
      {id:'music',label:'遥襟甫畅',dense:true,distance:2.25,paragraphs:['遥襟甫畅，逸兴遄飞。<br>爽籁发而清风生，纤歌凝而白云遏。', '睢园绿竹，气凌彭泽之樽；<br>邺水朱华，光照临川之笔。', '四美具，二难并。<br>穷睇眄于中天，极娱游于暇日。'],alt:'阁中琴师拨弦，宾客临风举杯，竹影与江光映着诗兴初起的年轻文士。'},
      {id:'sky',label:'天高地迥',dark:true,paragraphs:['天高地迥，觉宇宙之无穷；<br>兴尽悲来，识盈虚之有数。', '望长安于日下，目吴会于云间。<br>地势极而南溟深，<br>天柱高而北辰远。'],alt:'高阁栏外秋夜初临，江山消融于深蓝天际，一位年轻旅人远望无穷天地。',weather:[.65,0,0]},
      {id:'travelers',label:'萍水相逢',dark:true,paragraphs:['关山难越，谁悲失路之人？<br>萍水相逢，尽是他乡之客。', '怀帝阍而不见，奉宣室以何年？'],alt:'宴散后几位异乡客隔桌相对，半盏清酒映着窗外遥远的江山与灯火。',fire:[.70,.64],weather:[.98,0,.05],portal:{to:'fate',point:[.63,.67],label:'点击席间的半盏酒，进入王勃对身世的沉思'}},
      {id:'fate',label:'时运不齐，命途多舛',dark:true,dense:true,paragraphs:['嗟乎！时运不齐，命途多舛。<br>冯唐易老，李广难封。', '屈贾谊于长沙，非无圣主；<br>窜梁鸿于海曲，岂乏明时？'],alt:'年轻文士静坐旧书与灯影之间，窗外遥路与远山象征先贤的迁谪和不得志。',fire:[.52,.70],weather:[.98,0,.065]},
      {id:'resolve',label:'不坠青云之志',dense:true,distance:2.3,paragraphs:['所赖君子见机，达人知命。<br>老当益壮，宁移白首之心？<br><span class="spoken">穷且益坚，不坠青云之志。</span>', '酌贪泉而觉爽，处涸辙以犹欢。<br>北海虽赊，扶摇可接；<br>东隅已逝，桑榆非晚。'],alt:'王勃立在高阁外迎风远望，云隙中透出清光，袖中书卷与青山相映，神情坚定。',weather:[.98,-.04,0],portal:{to:'scholar',point:[.65,.69],label:'点击袖中的书卷，走近一介书生的志向'}},
      {id:'scholar',label:'一介书生',dense:true,distance:2.3,paragraphs:['孟尝高洁，空余报国之情；<br>阮籍猖狂，岂效穷途之哭！', '勃，三尺微命，一介书生。<br>无路请缨，等终军之弱冠；<br>有怀投笔，慕宗悫之长风。', '舍簪笏于百龄，奉晨昏于万里。'],alt:'年轻的王勃整好简朴行囊与卷册，书案旁有一支笔，窗外帆船启行，遥想万里省亲之路。'},
      {id:'friendship',label:'钟期既遇',paragraphs:['非谢家之宝树，接孟氏之芳邻。<br>他日趋庭，叨陪鲤对；<br>今兹捧袂，喜托龙门。', '杨意不逢，抚凌云而自惜；<br>钟期既遇，奏流水以何惭？'],alt:'一张古琴临江而置，年轻文士与知音静坐相对，清水般的琴声回应席间相知。',portal:{to:'writing',point:[.65,.69],label:'点击古琴，进入王勃挥毫作序的近景'}},
      {id:'writing',label:'敢竭鄙怀，恭疏短引',dark:true,dense:true,distance:2.35,paragraphs:['呜呼！胜地不常，盛筵难再；<br>兰亭已矣，梓泽丘墟。', '临别赠言，幸承恩于伟饯；<br>登高作赋，是所望于群公。', '敢竭鄙怀，恭疏短引；<br>一言均赋，四韵俱成。<br>请洒潘江，各倾陆海云尔。'],alt:'想象中的王勃在滕王阁灯下挥笔作序，席上众人安静聆听，江月与纸面交相照亮。',fire:[.51,.70],weather:[.98,0,.07]},
      {id:'time',label:'滕王高阁临江渚',paragraphs:['滕王高阁临江渚，<br>佩玉鸣鸾罢歌舞。', '画栋朝飞南浦云，<br>珠帘暮卷西山雨。'],alt:'繁华退去后，高阁朱柱与珠帘对着流云暮雨，空席无声，江水仍绕洲渚。',weather:[.61,.12,.04],fire:[.67,.65],portal:{to:'river',point:[.67,.65],label:'点击空阁的孤灯，走进诗人面对岁月与江流的心境'}},
      {id:'river',label:'槛外长江空自流',dark:true,paragraphs:['闲云潭影日悠悠，<br>物换星移几度秋。', '阁中帝子今何在？<br><span class="spoken">槛外长江空自流。</span>'],alt:'年轻王勃停笔凝望槛外江流，空阁、云影与无尽秋水化为写作时对盛衰和岁月的遥思。',weather:[.72,0,.04],fire:[.51,.71],distance:2.3}
    ]
  }
];
books.push({
  slug: 'tian-jing-sha-qiu-si', title: '天净沙·秋思', author: '马致远',
  source: 'qiusi.txt', seal: '秋', prefix: 'qiu',
  scenes: [
    { id: 'vines', label: '枯藤老树昏鸦', mobile: '87% 50%', softLight: true,
      paragraphs: ['枯藤老树昏鸦，'],
      alt: '秋暮古道旁，枯藤缠绕老树，昏鸦归栖；远处旅人与瘦马沿山路缓行。',
      weather: [.98, -.12, 0], camera: [1.055, 1.025] },
    { id: 'bridge', label: '小桥流水人家', mobile: '82% 50%', softLight: true,
      paragraphs: ['小桥流水人家，'],
      alt: '小木桥横跨秋日溪水，桥后人家亮起暖灯，炊烟和水影透出归家的安宁。',
      weather: [.62, -.05, .035], fire: [.72, .56] },
    { id: 'road', label: '古道西风', mobile: '80% 50%', softLight: true,
      paragraphs: ['古道西风'],
      alt: '西风吹动枯草与黄叶，古道伸向远山，身着旧蓝衣的旅人牵着一匹瘦马。',
      weather: [.98, -.26, 0], camera: [1.025, 1.085],
      portal: { to: 'horse', point: [.77, .54], label: '点击古道上的瘦马，走近行旅的疲惫' } },
    { id: 'horse', label: '瘦马', mobile: '88% 50%', softLight: true,
      paragraphs: ['瘦马。'],
      alt: '近看古道旁的瘦马、旧鞍与布包，旅人握着缰绳，落叶静静伏在蹄边。',
      weather: [.98, -.12, 0], camera: [1.075, 1.025] },
    { id: 'sunset', label: '夕阳西下', mobile: '75% 50%',
      paragraphs: ['夕阳西下，'],
      alt: '夕阳沉向遥远的山际，秋野古道上的旅人与马化成渺小背影，天地渐入暮色。',
      weather: [.98, -.06, 0], camera: [1.07, 1.025],
      portal: { to: 'writing', point: [.78, .71], label: '点击暮色中的归路，进入马致远写作时的心境' } },
    { id: 'writing', label: '断肠人在天涯', dark: true, mobile: '83% 50%',
      paragraphs: ['<span class="spoken">断肠人在天涯。</span>'],
      alt: '想象中的马致远在客舍孤灯前停笔，窗外瘦马、古道与远山沉入暮色，乡愁落在纸边。',
      weather: [.98, 0, .045], fire: [.77, .64], distance: 2.2, camera: [1.025, 1.07] }
  ]
});
const calibration = require('./calibration.json');
for (const book of books) for (const scene of book.scenes) {
  scene.art = book.prefix + '-' + scene.id;
  const adjusted = calibration[scene.art] || {};
  if (adjusted.point && scene.portal) scene.portal.point = adjusted.point;
  for (const key of ['mobile','fire','dark','mobileBottom','weather','softLight']) if (adjusted[key] !== undefined) scene[key] = adjusted[key];
  scene.mobile ??= '70% 50%';
  scene.weather ??= [.98, 0, 0];
}
module.exports = books;
