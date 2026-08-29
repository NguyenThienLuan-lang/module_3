import { Drink, Store, PastOrder } from '../types';

export const DRINKS_DATABASE: Drink[] = [
  {
    id: 'cold-brew-orange-lemongrass',
    name: 'Cold Brew Cam Sả Vàng',
    vietnameseName: 'Cold Brew Cam Sả Tươi',
    category: 'coffee',
    description: 'Cà phê ủ lạnh 16 tiếng kết hợp nước cam tươi mọng nước và hương thơm thanh khiết từ sả tươi.',
    benefits: [
      'Tỉnh táo êm dịu, không gây cồn cào tim hay say cafein đột ngột',
      'Giàu Vitamin C từ cam tươi tăng cường sức đề kháng',
      'Hương thơm tinh dầu sả giúp giải tỏa căng thẳng đầu óc'
    ],
    whyItFits: 'Rất thích hợp khi bạn đang buồn ngủ và thiếu tập trung trong giờ làm việc. Cung cấp caffeine êm dịu kết hợp vitamin C giúp lấy lại năng lượng tức thì.',
    calories: 85,
    sugarGrams: 9,
    caffeineMg: 110,
    ingredients: ['Cà phê Arabica Cầu Đất ủ lạnh', 'Nước cam sành vắt tươi', 'Sả tươi đập dập', 'Mật ong nguyên chất 5ml'],
    priceVND: 49000,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=700&auto=format&fit=crop&q=80',
    isHotAvailable: false,
    isColdAvailable: true,
    containsLactose: false,
    containsCaffeine: true,
    containsNuts: false,
    isVegan: true,
    tags: ['sleepy', 'focus', 'refresh', 'low_sugar', 'caffeine', 'fruity'],
    suggestedToppings: [
      { name: 'Thạch sả mật ong', price: 8000, benefit: 'Thanh mát, thơm dịu' },
      { name: 'Hạt chia hữu cơ', price: 6000, benefit: 'Bổ sung chất xơ và Omega 3' }
    ],
    homeRecipe: {
      prepTime: '10 phút (ủ lạnh trước)',
      difficulty: 'Dễ',
      steps: [
        'Chuẩn bị 100ml Cold brew (hoặc cà phê phin loãng pha lạnh).',
        'Vắt 1 quả cam sành lấy nước cốt, giữ lại 1 lát cam mỏng.',
        'Đập dập 1 nhánh sả cho vào ly cùng đá viên.',
        'Rót nước cam vào, sau đó rót từ từ cold brew lên trên tạo tầng màu đẹp mắt.'
      ],
      tips: 'Không nên dùng nước sôi trực tiếp vì sẽ làm giảm hàm lượng vitamin C trong cam.'
    }
  },
  {
    id: 'chamomile-honey-red-apple',
    name: 'Trà Hoa Cúc Mật Ong Táo Đỏ',
    vietnameseName: 'Trà Hoa Cúc Mật Ong & Kỷ Tử Táo Đỏ',
    category: 'herbal',
    description: 'Thức trà thảo mộc ấm áp kết hợp hoa cúc trắng sấy lạnh, táo đỏ Tân Cương, kỷ tử đỏ và mật ong hoa nhãn.',
    benefits: [
      'Làm dịu hệ thần kinh trung ương, giảm nồng độ cortisol do căng thẳng',
      'Thanh can, sáng mắt, hỗ trợ giấc ngủ sâu tự nhiên',
      'Kháng viêm nhẹ và bổ khí huyết từ táo đỏ'
    ],
    whyItFits: 'Lựa chọn số 1 khi bạn đang chịu nhiều áp lực (stress), lo âu hoặc mệt mỏi tinh thần. Hoàn toàn không chứa caffeine nên rất êm dịu cho dạ dày.',
    calories: 60,
    sugarGrams: 8,
    caffeineMg: 0,
    ingredients: ['Hoa cúc chi sấy lạnh', 'Táo đỏ thái lát', 'Kỷ tử', 'Mật ong rừng hữu cơ'],
    priceVND: 45000,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=700&auto=format&fit=crop&q=80',
    isHotAvailable: true,
    isColdAvailable: true,
    containsLactose: false,
    containsCaffeine: false,
    containsNuts: false,
    isVegan: false,
    tags: ['stressed', 'anxious', 'stress_relief', 'relax', 'herbal', 'no_caffeine', 'hot'],
    suggestedToppings: [
      { name: 'Nha đam tươi giòn', price: 7000, benefit: 'Mát gan, thanh nhiệt' },
      { name: 'Hạt sen Huế hầm mềm', price: 10000, benefit: 'An thần, dưỡng tâm' }
    ],
    homeRecipe: {
      prepTime: '5 phút',
      difficulty: 'Dễ',
      steps: [
        'Rửa sạch 5 bông cúc khô, 2 quả táo đỏ cắt lát và 10 hạt kỷ tử.',
        'Hãm với 250ml nước sôi 90°C trong 7-10 phút.',
        'Để nguội bớt xuống 50°C rồi cho 1-2 muỗng mật ong vào khuấy đều.'
      ],
      tips: 'Mật ong chỉ nên cho vào khi nước ấm dưới 60°C để bảo toàn enzym quý.'
    }
  },
  {
    id: 'ginger-lemongrass-citrus-warm',
    name: 'Trà Gừng Chanh Sả Mật Ong Nóng',
    vietnameseName: 'Trà Gừng Sả Tắc Mật Ong Ấm',
    category: 'herbal',
    description: 'Nước cốt gừng tươi già cay nồng ấm phối hợp tinh dầu sả, nước cốt tắc tươi và mật ong làm dịu thanh quản.',
    benefits: [
      'Gingerol trong gừng giúp kháng khuẩn tự nhiên, giảm sưng rát cổ họng',
      'Làm ấm phổi và đường hô hấp, giải cảm lạnh tức thì',
      'Kích thích bài tiết dịch tiêu hóa, giảm ợ chua, đầy hơi'
    ],
    whyItFits: 'Cực kỳ phù hợp khi bạn bị đau họng, khàn tiếng hoặc cảm thấy cơ thể ớn lạnh. Giúp xoa dịu vòm họng và giữ ấm nội tạng.',
    calories: 55,
    sugarGrams: 10,
    caffeineMg: 0,
    ingredients: ['Gừng già tươi thái lát đập dập', 'Sả đập dập', 'Nước cốt quả tắc (quất)', 'Mật ong hoa rừng'],
    priceVND: 42000,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=700&auto=format&fit=crop&q=80',
    isHotAvailable: true,
    isColdAvailable: false,
    containsLactose: false,
    containsCaffeine: false,
    containsNuts: false,
    isVegan: false,
    tags: ['sore_throat', 'cold_flu', 'immunity', 'herbal', 'hot', 'no_caffeine'],
    suggestedToppings: [
      { name: 'Lát gừng sên mật ong', price: 6000, benefit: 'Thêm vị cay ấm' },
      { name: 'Xí muội thảo mộc', price: 6000, benefit: 'Dịu ngứa họng' }
    ],
    homeRecipe: {
      prepTime: '8 phút',
      difficulty: 'Dễ',
      steps: [
        'Cắt 4-5 lát gừng già và 1 cây sả đập dập, đun sôi với 300ml nước trong 5 phút.',
        'Rót ra ly, vắt 1-2 quả tắc tươi bỏ hạt.',
        'Hòa cùng 1 muỗng canh mật ong và uống từng ngụm ấm chậm rãi.'
      ],
      tips: 'Uống từng ngụm nhỏ và giữ ở họng vài giây trước khi nuốt để phát huy tối đa tác dụng sát khuẩn.'
    }
  },
  {
    id: 'celery-greenapple-cucumber-detox',
    name: 'Nước Ép Cần Tây Táo Xanh Dưa Leo',
    vietnameseName: 'Green Detox Cần Tây & Táo Xanh',
    category: 'juice_detox',
    description: 'Nước ép nguyên chất ép chậm giữ trọn vẹn enzyme sống từ cần tây Đà Lạt, táo xanh Granny Smith và dưa leo giòn ngọt.',
    benefits: [
      'Giàu chất chống oxy hóa và kali giúp thanh lọc độc tố gan và thận',
      'Giảm tích nước, hỗ trợ tiêu sưng và làm mát cơ thể, giảm mụn nhọt',
      'Cung cấp vitamin A, C, K dồi dào tăng sức khỏe làn da'
    ],
    whyItFits: 'Lý tưởng cho tình trạng nóng trong người, nổi mụn bọc, cảm giác nặng nề sau chuỗi ngày ăn đồ dầu mỡ hoặc cay nóng.',
    calories: 70,
    sugarGrams: 11,
    caffeineMg: 0,
    ingredients: ['Cần tây hữu cơ Đà Lạt', 'Táo xanh', 'Dưa leo tươi', 'Một lát chanh vàng và gừng nhỏ'],
    priceVND: 52000,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=700&auto=format&fit=crop&q=80',
    isHotAvailable: false,
    isColdAvailable: true,
    containsLactose: false,
    containsCaffeine: false,
    containsNuts: false,
    isVegan: true,
    tags: ['internal_heat', 'detox', 'low_sugar', 'no_sugar', 'fruity', 'no_caffeine'],
    suggestedToppings: [
      { name: 'Hạt chia ngâm nước dừa', price: 6000, benefit: 'Thêm chất xơ hòa tan' },
      { name: 'Nha đam tươi cắt hạt lựu', price: 8000, benefit: 'Thanh nhiệt cấp ẩm' }
    ]
  },
  {
    id: 'pineapple-mint-kombucha',
    name: 'Kombucha Dứa Bạc Hà Men Sống',
    vietnameseName: 'Kombucha Thơm (Dứa) & Lá Bạc Hà',
    category: 'kombucha',
    description: 'Trà lên men tự nhiên giàu probiotics kết hợp vị ngọt dịu của dứa tươi và the mát sảng khoái của lá bạc hà.',
    benefits: [
      'Bổ sung hàng tỷ lợi khuẩn đường ruột, hỗ trợ tiêu hóa nhanh thức ăn',
      'Enzym bromelain trong dứa giúp phân giải protein, giảm cảm giác đầy trướng bụng',
      'Hơi ga nhẹ tự nhiên tạo cảm giác nhẹ nhõm sảng khoái tức thì'
    ],
    whyItFits: 'Cứu tinh hoàn hảo khi bạn bị đầy bụng, ăn khó tiêu hoặc cảm giác tức bụng sau bữa trưa/bữa tối no nê.',
    calories: 50,
    sugarGrams: 6,
    caffeineMg: 15,
    ingredients: ['Kombucha cốt trà đen & xanh', 'Nước ép dứa chín tới', 'Lá bạc hà tươi nghiền nhẹ'],
    priceVND: 55000,
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=700&auto=format&fit=crop&q=80',
    isHotAvailable: false,
    isColdAvailable: true,
    containsLactose: false,
    containsCaffeine: false,
    containsNuts: false,
    isVegan: true,
    tags: ['bloated', 'digestion', 'low_sugar', 'sour', 'refresh'],
    suggestedToppings: [
      { name: 'Thạch nha đam hữu cơ', price: 8000, benefit: 'Mềm mát đường ruột' },
      { name: 'Hạt é nhiệt đới', price: 5000, benefit: 'Nhuận tràng mát gan' }
    ]
  },
  {
    id: 'avocado-banana-plant-protein',
    name: 'Sinh Tố Bơ Chuối Whey Protein Hạt',
    vietnameseName: 'Sinh Tố Bơ Chuối Sữa Hạt Phục Hồi',
    category: 'smoothie',
    description: 'Bơ sáp dẻo quánh xay cùng chuối tiêu chín tự nhiên, sữa yến mạch và hạt chia hữu cơ giàu năng lượng lành mạnh.',
    benefits: [
      'Cung cấp chất béo không bão hòa đơn tốt cho tim mạch và não bộ',
      'Bổ sung kali và magie giúp chống chuột rút và phục hồi cơ bắp',
      'Tạo cảm giác no lâu bền vững, duy trì đường huyết ổn định'
    ],
    whyItFits: 'Cực kỳ tối ưu cho người vừa tập thể thao, gym, yoga hoặc người làm việc thể chất cần bổ sung năng lượng sạch.',
    calories: 280,
    sugarGrams: 16,
    caffeineMg: 0,
    ingredients: ['Bơ sáp Đắk Lắk', 'Chuối tiêu đông lạnh', 'Sữa yến mạch hữu cơ', 'Hạt chia', 'Chút mật ong'],
    priceVND: 58000,
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=700&auto=format&fit=crop&q=80',
    isHotAvailable: false,
    isColdAvailable: true,
    containsLactose: false,
    containsCaffeine: false,
    containsNuts: false,
    isVegan: true,
    tags: ['post_workout', 'muscle_recovery', 'creamy', 'no_caffeine', 'energy'],
    suggestedToppings: [
      { name: 'Ngũ cốc Granola giòn', price: 10000, benefit: 'Thêm giòn rụm và khoáng chất' },
      { name: 'Bột protein thực vật', price: 15000, benefit: 'Tăng 15g protein tinh khiết' }
    ]
  },
  {
    id: 'pennywort-mungbean-coconut',
    name: 'Rau Má Đậu Xanh Sữa Dừa Tươi',
    vietnameseName: 'Rau Má Đậu Xanh Cốt Dừa',
    category: 'herbal',
    description: 'Rau má tươi đồng bằng xay mịn thanh mát kết hợp lớp đậu xanh đánh nhuyễn bùi béo và nước cốt dừa thanh nhẹ.',
    benefits: [
      'Thanh nhiệt giải độc gan, hỗ trợ đào thải chất cặn bã khỏi cơ thể',
      'Giàu chất chống oxy hóa tự nhiên giúp hạ hỏa và dịu mụn trứng cá',
      'Đậu xanh bổ sung chất xơ và protein thực vật mát tính'
    ],
    whyItFits: 'Thức uống truyền thống tuyệt vời cho ngày nắng gắt, người cảm thấy bứt rứt trong người hoặc muốn giải nhiệt tức thì.',
    calories: 140,
    sugarGrams: 14,
    caffeineMg: 0,
    ingredients: ['Rau má tươi VietGAP', 'Đậu xanh hấp tán nhuyễn', 'Nước cốt dừa tươi', 'Nước dừa xiêm'],
    priceVND: 35000,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&auto=format&fit=crop&q=80',
    isHotAvailable: false,
    isColdAvailable: true,
    containsLactose: false,
    containsCaffeine: false,
    containsNuts: false,
    isVegan: true,
    tags: ['internal_heat', 'detox', 'herbal', 'creamy', 'no_caffeine'],
    suggestedToppings: [
      { name: 'Sương sáo đen dẻo', price: 6000, benefit: 'Giải nhiệt cực tốt' },
      { name: 'Trân châu dừa giòn', price: 7000, benefit: 'Nhai sần sật vui miệng' }
    ]
  },
  {
    id: 'salt-coffee-vietnamese',
    name: 'Cà Phê Muối Kem Béo Đậm Đà',
    vietnameseName: 'Cà Phê Muối Xứ Huế',
    category: 'coffee',
    description: 'Cà phê phin Robusta Đắk Lắk đậm hương quyện cùng lớp kem muối biển mịn màng, cân bằng hoàn hảo giữa đắng và mặn béo.',
    benefits: [
      'Muối biển làm bật vị ngọt hậu tự nhiên của cà phê, giảm vị chát gắt',
      'Kích thích tiết dopamine tạo hưng phấn và tăng năng suất làm việc',
      'Hương vị độc đáo khơi gợi cảm hứng sáng tạo'
    ],
    whyItFits: 'Khi bạn cần một cú hích tinh thần sảng khoái, muốn thưởng thức đồ uống đậm vị béo ngọt để nạp lại nguồn cảm hứng.',
    calories: 190,
    sugarGrams: 15,
    caffeineMg: 140,
    ingredients: ['Cà phê Robusta & Arabica phối trộn', 'Kem sữa tươi béo ngậy', 'Muối hồng Himalaya', 'Sữa đặc'],
    priceVND: 42000,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=700&auto=format&fit=crop&q=80',
    isHotAvailable: true,
    isColdAvailable: true,
    containsLactose: true,
    containsCaffeine: true,
    containsNuts: false,
    isVegan: false,
    tags: ['happy', 'excited', 'focus', 'creamy', 'bold_rich', 'caffeine'],
    suggestedToppings: [
      { name: 'Thêm lớp kem muối double', price: 10000, benefit: 'Béo ngậy ngập tràn' },
      { name: 'Thạch cà phê giòn', price: 8000, benefit: 'Đậm đà hương cà phê' }
    ]
  },
  {
    id: 'lotus-jasmine-longan-tea',
    name: 'Trà Lài Hạt Sen Vàng Long Nhãn',
    vietnameseName: 'Trà Lài Hạt Sen Cố Đô Long Nhãn',
    category: 'tea',
    description: 'Trà hoa lài Bảo Lộc ướp hương thơm ngát kết hợp hạt sen Huế bùi mềm và long nhãn Hưng Yên ngọt thanh tao.',
    benefits: [
      'Hạt sen chứa kiềm glucoside giúp an thần, định tâm, xoa dịu thần kinh',
      'Hương hoa lài thanh khiết giải tỏa căng thẳng sau giờ làm việc mệt mỏi',
      'Vị ngọt thanh nhẹ nhàng từ long nhãn, không gây gắt cổ'
    ],
    whyItFits: 'Phù hợp khi bạn cảm thấy bồn chồn, stress kéo dài hoặc cần một thức uống tĩnh tâm vào buổi chiều tối.',
    calories: 110,
    sugarGrams: 12,
    caffeineMg: 25,
    ingredients: ['Trà xanh ướp hoa lài tươi', 'Hạt sen Huế hầm đường phèn', 'Long nhãn Hưng Yên sấy dẻo'],
    priceVND: 52000,
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=700&auto=format&fit=crop&q=80',
    isHotAvailable: true,
    isColdAvailable: true,
    containsLactose: false,
    containsCaffeine: true,
    containsNuts: false,
    isVegan: true,
    tags: ['stressed', 'anxious', 'stress_relief', 'relax', 'herbal', 'low_sugar'],
    suggestedToppings: [
      { name: 'Củ năng giòn ngọt', price: 8000, benefit: 'Mát lành, giòn sần sật' },
      { name: 'Thạch hoa quế hoàng kim', price: 8000, benefit: 'Thơm quý phái' }
    ]
  },
  {
    id: 'oat-walnut-warm-milk',
    name: 'Sữa Hạt Yến Mạch Óc Chó Ấm Vani',
    vietnameseName: 'Sữa Hạt Óc Chó Yến Mạch Ấm Vani',
    category: 'milk_nut',
    description: 'Sữa hạt thực vật 100% nguyên chất từ yến mạch nguyên cám và quả óc chó giàu dưỡng chất, hương vani Madagascar ấm áp.',
    benefits: [
      '100% không chứa đường Lactose, không lo đau bụng hay dị ứng sữa bò',
      'Giàu Omega-3 và Magie nuôi dưỡng tế bào não và giảm stress',
      'Chất xơ beta-glucan giúp ổn định màng nhầy niêm mạc dạ dày'
    ],
    whyItFits: 'Thức uống hoàn hảo cho người dị ứng sữa động vật (Lactose Intolerance) hoặc người có dạ dày nhạy cảm cần sự êm ấm.',
    calories: 160,
    sugarGrams: 5,
    caffeineMg: 0,
    ingredients: ['Yến mạch Úc nguyên cám', 'Nhân quả óc chó Mỹ', 'Chiết xuất vani tự nhiên', 'Đường thốt nốt hữu cơ nhẹ'],
    priceVND: 48000,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=700&auto=format&fit=crop&q=80',
    isHotAvailable: true,
    isColdAvailable: true,
    containsLactose: false,
    containsCaffeine: false,
    containsNuts: true,
    isVegan: true,
    tags: ['stomach_sensitive', 'relax', 'creamy', 'no_caffeine', 'hot', 'vegan'],
    suggestedToppings: [
      { name: 'Bột quế Ceylon rắc nhẹ', price: 4000, benefit: 'Ấm bụng, hỗ trợ trao đổi chất' },
      { name: 'Hạt bí xanh nướng thơm', price: 8000, benefit: 'Thêm kẽm và độ giòn' }
    ]
  },
  {
    id: 'matcha-oat-latte-pure',
    name: 'Matcha Oat Latte Nhật Bản',
    vietnameseName: 'Matcha Sữa Yến Mạch Uji Không Đường',
    category: 'tea',
    description: 'Bột trà xanh Matcha thượng hạng vùng Uji (Kyoto) đánh bọt truyền thống cùng sữa yến mạch sánh mịn béo dịu.',
    benefits: [
      'L-Theanine kết hợp caffeine tự nhiên tạo trạng thái tập trung sâu (Flow State) mà không hồi hộp',
      'Giàu chất chống oxy hóa EGCG bảo vệ tế bào và làm chậm lão hóa',
      'Sữa yến mạch thực vật lành mạnh, tiêu hóa êm ái'
    ],
    whyItFits: 'Phù hợp khi bạn cần tập trung làm việc, học tập với cường độ cao mà muốn tránh cảm giác nôn nao của cà phê thông thường.',
    calories: 130,
    sugarGrams: 4,
    caffeineMg: 65,
    ingredients: ['Matcha Uji ceremonial grade', 'Sữa yến mạch Oatside', 'Nước khoáng nóng 80°C'],
    priceVND: 59000,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=700&auto=format&fit=crop&q=80',
    isHotAvailable: true,
    isColdAvailable: true,
    containsLactose: false,
    containsCaffeine: true,
    containsNuts: false,
    isVegan: true,
    tags: ['focus', 'sleepy', 'low_sugar', 'no_sugar', 'creamy', 'vegan'],
    suggestedToppings: [
      { name: 'Sương sáo thảo mộc', price: 7000, benefit: 'Mát gan giảm nhiệt' },
      { name: 'Kem cheese thực vật', price: 12000, benefit: 'Tăng độ ngậy béo' }
    ]
  },
  {
    id: 'fresh-coconut-calamansi-pink-salt',
    name: 'Nước Dừa Tươi Tắc Muối Hồng',
    vietnameseName: 'Nước Dừa Xiêm Tắc & Muối Hồng Himalaya',
    category: 'juice_detox',
    description: 'Nước dừa xiêm Bến Tre tươi ngọt thanh phối hợp nước cốt quả tắc mọng nước và một chút muối khoáng hồng Himalaya.',
    benefits: [
      'Bù khoáng điện giải (Kali, Natri, Magie) tự nhiên gấp nhiều lần nước lọc',
      'Giúp phục hồi cơ thể nhanh chóng khi mất nước, say nắng hoặc mệt mỏi',
      'Vị chua ngọt dịu và mặn nhẹ kích thích vị giác sảng khoái tức thì'
    ],
    whyItFits: 'Lựa chọn số một khi bạn bị mất nước, đi ngoài nắng về mệt mỏi, háo nước hoặc cảm thấy uể oải thiếu sinh lực.',
    calories: 65,
    sugarGrams: 8,
    caffeineMg: 0,
    ingredients: ['Nước dừa xiêm tươi Bến Tre nguyên chất', 'Nước cốt tắc tươi', 'Muối khoáng hồng Himalaya', 'Cơm dừa non xắt sợi'],
    priceVND: 38000,
    image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=700&auto=format&fit=crop&q=80',
    isHotAvailable: false,
    isColdAvailable: true,
    containsLactose: false,
    containsCaffeine: false,
    containsNuts: false,
    isVegan: true,
    tags: ['dehydrated', 'tired', 'hydration', 'refresh', 'sour', 'no_caffeine'],
    suggestedToppings: [
      { name: 'Cơm dừa non giòn sần sật', price: 6000, benefit: 'Nhai ngọt bùi' },
      { name: 'Hạt é nhiệt đới', price: 5000, benefit: 'Mát gan cấp ẩm' }
    ]
  }
];

export const STORES_DATABASE: Store[] = [
  {
    id: 'store-phuc-long-le-loi',
    name: 'Phúc Long Coffee & Tea - Lê Lợi',
    brand: 'Phúc Long',
    address: '122 Lê Lợi, Phường Bến Thành, Quận 1',
    district: 'Quận 1',
    city: 'Hồ Chí Minh',
    latitude: 10.7725,
    longitude: 106.6983,
    rating: 4.8,
    reviewCount: 1420,
    deliveryTimeMins: 18,
    deliveryFeeVND: 16000,
    openHours: '07:00 - 22:30',
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=700&auto=format&fit=crop&q=80',
    promoBadge: 'Giảm 20k đơn từ 99k',
    externalLinks: {
      grabFoodUrl: 'https://food.grab.com/vn/vi/restaurant/phuc-long-coffee-tea',
      shopeeFoodUrl: 'https://shopeefood.vn/ho-chi-minh/phuc-long-tea-coffee',
      googleMapsUrl: 'https://maps.google.com/?q=10.7725,106.6983'
    },
    menuItems: [
      { drinkId: 'lotus-jasmine-longan-tea', price: 55000, isSignature: true, isAvailable: true },
      { drinkId: 'cold-brew-orange-lemongrass', price: 52000, isAvailable: true },
      { drinkId: 'matcha-oat-latte-pure', price: 62000, isAvailable: true },
      { drinkId: 'chamomile-honey-red-apple', price: 48000, isAvailable: true }
    ]
  },
  {
    id: 'store-the-coffee-house-nguyen-thi-minh-khai',
    name: 'The Coffee House - Nguyễn Thị Minh Khai',
    brand: 'The Coffee House',
    address: '86-88 Nguyễn Thị Minh Khai, Phường 6, Quận 3',
    district: 'Quận 3',
    city: 'Hồ Chí Minh',
    latitude: 10.7788,
    longitude: 106.6922,
    rating: 4.7,
    reviewCount: 980,
    deliveryTimeMins: 22,
    deliveryFeeVND: 18000,
    openHours: '07:00 - 22:00',
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=700&auto=format&fit=crop&q=80',
    promoBadge: 'Freeship 2km',
    externalLinks: {
      grabFoodUrl: 'https://food.grab.com/vn/vi/restaurant/the-coffee-house',
      shopeeFoodUrl: 'https://shopeefood.vn/ho-chi-minh/the-coffee-house',
      googleMapsUrl: 'https://maps.google.com/?q=10.7788,106.6922'
    },
    menuItems: [
      { drinkId: 'cold-brew-orange-lemongrass', price: 49000, isSignature: true, isAvailable: true },
      { drinkId: 'ginger-lemongrass-citrus-warm', price: 45000, isAvailable: true },
      { drinkId: 'salt-coffee-vietnamese', price: 45000, isSignature: true, isAvailable: true },
      { drinkId: 'chamomile-honey-red-apple', price: 45000, isAvailable: true }
    ]
  },
  {
    id: 'store-detox-lanh-organic',
    name: 'Tiệm Nước Ép & Detox Lành (Organic Juice Bar)',
    brand: 'Detox Lành',
    address: '42 Trương Định, Phường Võ Thị Sáu, Quận 3',
    district: 'Quận 3',
    city: 'Hồ Chí Minh',
    latitude: 10.7761,
    longitude: 106.6891,
    rating: 4.9,
    reviewCount: 530,
    deliveryTimeMins: 15,
    deliveryFeeVND: 14000,
    openHours: '06:30 - 21:00',
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=700&auto=format&fit=crop&q=80',
    promoBadge: 'Tặng Hạt Chia Mọi Cốc',
    externalLinks: {
      grabFoodUrl: 'https://food.grab.com/vn/vi/restaurant/detox-lanh-juice',
      shopeeFoodUrl: 'https://shopeefood.vn/ho-chi-minh/detox-lanh',
      googleMapsUrl: 'https://maps.google.com/?q=10.7761,106.6891'
    },
    menuItems: [
      { drinkId: 'celery-greenapple-cucumber-detox', price: 52000, isSignature: true, isAvailable: true },
      { drinkId: 'fresh-coconut-calamansi-pink-salt', price: 38000, isSignature: true, isAvailable: true },
      { drinkId: 'pineapple-mint-kombucha', price: 55000, isAvailable: true },
      { drinkId: 'avocado-banana-plant-protein', price: 58000, isAvailable: true }
    ]
  },
  {
    id: 'store-katinat-saigon-kafe',
    name: 'Katinat Saigon Kafe - Hàm Nghi',
    brand: 'Katinat',
    address: '58 Hàm Nghi, Phường Bến Nghé, Quận 1',
    district: 'Quận 1',
    city: 'Hồ Chí Minh',
    latitude: 10.7712,
    longitude: 106.7029,
    rating: 4.7,
    reviewCount: 2100,
    deliveryTimeMins: 20,
    deliveryFeeVND: 17000,
    openHours: '06:30 - 23:00',
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=700&auto=format&fit=crop&q=80',
    promoBadge: 'Flash sale 15%',
    externalLinks: {
      grabFoodUrl: 'https://food.grab.com/vn/vi/restaurant/katinat-saigon-kafe',
      shopeeFoodUrl: 'https://shopeefood.vn/ho-chi-minh/katinat-saigon-kafe',
      googleMapsUrl: 'https://maps.google.com/?q=10.7712,106.7029'
    },
    menuItems: [
      { drinkId: 'salt-coffee-vietnamese', price: 45000, isSignature: true, isAvailable: true },
      { drinkId: 'lotus-jasmine-longan-tea', price: 56000, isSignature: true, isAvailable: true },
      { drinkId: 'cold-brew-orange-lemongrass', price: 54000, isAvailable: true },
      { drinkId: 'matcha-oat-latte-pure', price: 62000, isAvailable: true }
    ]
  },
  {
    id: 'store-rau-ma-mix-pasteur',
    name: 'Rau Má Mix & Thảo Mộc - Pasteur',
    brand: 'Rau Má Mix',
    address: '178 Pasteur, Phường Bến Nghé, Quận 1',
    district: 'Quận 1',
    city: 'Hồ Chí Minh',
    latitude: 10.7812,
    longitude: 106.6974,
    rating: 4.8,
    reviewCount: 890,
    deliveryTimeMins: 14,
    deliveryFeeVND: 12000,
    openHours: '07:30 - 21:30',
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&auto=format&fit=crop&q=80',
    promoBadge: 'Mua 2 tặng 1 thạch',
    externalLinks: {
      grabFoodUrl: 'https://food.grab.com/vn/vi/restaurant/rau-ma-mix',
      shopeeFoodUrl: 'https://shopeefood.vn/ho-chi-minh/rau-ma-mix',
      googleMapsUrl: 'https://maps.google.com/?q=10.7812,106.6974'
    },
    menuItems: [
      { drinkId: 'pennywort-mungbean-coconut', price: 35000, isSignature: true, isAvailable: true },
      { drinkId: 'fresh-coconut-calamansi-pink-salt', price: 38000, isAvailable: true },
      { drinkId: 'ginger-lemongrass-citrus-warm', price: 40000, isAvailable: true }
    ]
  },
  {
    id: 'store-nutty-oat-wellness-lab',
    name: 'The Healthy Nut Milk & Kombucha Lab',
    brand: 'Nutty & Kombucha',
    address: '15 Nam Kỳ Khởi Nghĩa, Phường Nguyễn Thái Bình, Quận 1',
    district: 'Quận 1',
    city: 'Hồ Chí Minh',
    latitude: 10.7695,
    longitude: 106.7001,
    rating: 4.9,
    reviewCount: 340,
    deliveryTimeMins: 19,
    deliveryFeeVND: 15000,
    openHours: '08:00 - 21:00',
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=700&auto=format&fit=crop&q=80',
    promoBadge: 'Thuần Thực Vật 100%',
    externalLinks: {
      grabFoodUrl: 'https://food.grab.com/vn/vi/restaurant/healthy-nut-milk-lab',
      shopeeFoodUrl: 'https://shopeefood.vn/ho-chi-minh/healthy-nut-milk',
      googleMapsUrl: 'https://maps.google.com/?q=10.7695,106.7001'
    },
    menuItems: [
      { drinkId: 'oat-walnut-warm-milk', price: 48000, isSignature: true, isAvailable: true },
      { drinkId: 'pineapple-mint-kombucha', price: 55000, isSignature: true, isAvailable: true },
      { drinkId: 'avocado-banana-plant-protein', price: 58000, isAvailable: true },
      { drinkId: 'matcha-oat-latte-pure', price: 59000, isAvailable: true }
    ]
  }
];

export const MOOD_OPTIONS = [
  { id: 'sleepy', label: 'Buồn ngủ, lờ đờ', emoji: '😴', color: 'from-amber-500/20 to-orange-500/10' },
  { id: 'stressed', label: 'Căng thẳng, stress', emoji: '🤯', color: 'from-red-500/20 to-rose-500/10' },
  { id: 'tired', label: 'Uể oải, kiệt sức', emoji: '🥱', color: 'from-yellow-500/20 to-amber-500/10' },
  { id: 'anxious', label: 'Lo âu, bồn chồn', emoji: '🥺', color: 'from-purple-500/20 to-indigo-500/10' },
  { id: 'happy', label: 'Vui vẻ, thư thái', emoji: '🥰', color: 'from-emerald-500/20 to-teal-500/10' },
  { id: 'excited', label: 'Hứng khởi, năng động', emoji: '⚡', color: 'from-cyan-500/20 to-blue-500/10' },
  { id: 'relax', label: 'Cần tĩnh tâm, chill', emoji: '🧘', color: 'from-sky-500/20 to-indigo-500/10' },
  { id: 'bored', label: 'Nhàm chán, thèm vị mới', emoji: '🤤', color: 'from-pink-500/20 to-fuchsia-500/10' }
];

export const BODY_STATUS_OPTIONS = [
  { id: 'sore_throat', label: 'Đau rát họng, khàn tiếng', emoji: '🧣', desc: 'Cần ấm họng, kháng viêm tự nhiên' },
  { id: 'internal_heat', label: 'Nóng trong người, nổi mụn', emoji: '🔥', desc: 'Cần thanh nhiệt, giải độc gan' },
  { id: 'bloated', label: 'Đầy bụng, khó tiêu', emoji: '🫄', desc: 'Cần men vi sinh, hỗ trợ tiêu hóa' },
  { id: 'post_workout', label: 'Vừa tập gym / thể thao', emoji: '💪', desc: 'Cần bù điện giải, bổ sung protein' },
  { id: 'cold_flu', label: 'Cảm lạnh, ớn lạnh', emoji: '🤧', desc: 'Cần làm ấm phổi, tăng miễn dịch' },
  { id: 'dehydrated', label: 'Khát nước, đi nắng về', emoji: '☀️', desc: 'Cần bù nước cấp tốc' },
  { id: 'stomach_sensitive', label: 'Dạ dày yếu, dễ cồn cào', emoji: '🍵', desc: 'Tránh đồ chua gắt hoặc cà phê đậm' },
  { id: 'caffeine_sensitive', label: 'Say cafein, ép tim', emoji: '💓', desc: 'Tuyệt đối không uống cà phê đậm' }
];

export const PREFERENCE_OPTIONS = [
  { id: 'low_sugar', label: 'Ít đường (30-50%)', emoji: '🍃' },
  { id: 'no_sugar', label: 'Không đường (0%)', emoji: '🌿' },
  { id: 'sour', label: 'Vị chua thanh mát', emoji: '🍋' },
  { id: 'creamy', label: 'Vị béo ngậy, sữa', emoji: '🥛' },
  { id: 'bold_rich', label: 'Đậm vị, thơm nồng', emoji: '☕' },
  { id: 'herbal', label: 'Thơm thảo mộc, hoa', emoji: '🌸' },
  { id: 'hot', label: 'Thích uống Nóng / Ấm', emoji: '♨️' },
  { id: 'iced', label: 'Thích uống Đá Mát Lạnh', emoji: '🧊' },
  { id: 'fruity', label: 'Trái cây tươi tự nhiên', emoji: '🍎' }
];

export const ALLERGY_OPTIONS = [
  { id: 'lactose', label: 'Dị ứng Lactose (Sữa bò)', warning: 'Tự động lọc bỏ sữa tươi, bọt foam sữa, phô mai' },
  { id: 'caffeine', label: 'Không dùng Cafein (Say cà phê / ép tim)', warning: 'Lọc bỏ cà phê, cold brew, matcha đậm' },
  { id: 'peanuts', label: 'Dị ứng Đậu phộng / Các loại Hạt', warning: 'Lọc bỏ sữa hạt, topping hạnh nhân, óc chó, đậu phộng' },
  { id: 'dairy', label: 'Kiêng hoàn toàn Sữa & Chế phẩm sữa', warning: 'Lọc bỏ bơ, kem béo, phô mai mặn, sữa đặc' },
  { id: 'gluten', label: 'Dị ứng Gluten (Lúa mạch, Yến mạch)', warning: 'Lọc bỏ các loại trà lúa mạch, topping ngũ cốc' },
  { id: 'vegan', label: 'Thuần Chay (Vegan 100%)', warning: 'Chỉ dùng nguyên liệu từ thực vật hữu cơ, mật hoa' }
];

export const GOAL_OPTIONS = [
  { id: 'focus', label: 'Tỉnh táo & Tập trung cao độ', icon: 'Sparkles' },
  { id: 'stress_relief', label: 'Xả stress & Thư giãn thần kinh', icon: 'HeartHandshake' },
  { id: 'detox', label: 'Thanh lọc & Thải độc cơ thể', icon: 'Droplets' },
  { id: 'muscle_recovery', label: 'Phục hồi cơ bắp & Năng lượng', icon: 'Zap' },
  { id: 'digestion', label: 'Nhẹ bụng & Kích thích tiêu hóa', icon: 'Leaf' },
  { id: 'hydration', label: 'Bù nước & Điện giải mát lành', icon: 'ShieldCheck' }
];

export const SAMPLE_PAST_ORDERS: PastOrder[] = [
  {
    id: 'ord-101',
    orderCode: 'DS-9824',
    createdAt: 'Hôm nay, 14:30',
    status: 'delivered',
    storeName: 'DailySip Flagship Nguyễn Du',
    deliveryAddress: 'Tòa nhà Bitexco, Q.1, TP.HCM',
    paymentMethod: 'Ví MoMo',
    subtotal: 94000,
    deliveryFee: 15000,
    discount: 15000,
    totalAmount: 94000,
    items: [
      {
        id: 'item-1',
        drinkId: 'cold-brew-orange-lemongrass',
        drinkName: 'Cold Brew Cam Sả Vàng',
        drinkImage: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=700&auto=format&fit=crop&q=80',
        storeId: 'store-1',
        storeName: 'DailySip Flagship Nguyễn Du',
        storeAddress: '12 Nguyễn Du, P. Bến Nghé, Quận 1',
        unitPrice: 49000,
        quantity: 1,
        customization: {
          size: 'M',
          ice: '50% đá',
          sweetness: '30%',
          toppings: [{ name: 'Thạch sả mật ong', price: 8000 }],
          specialNote: 'Giao nhanh giúp mình nhé'
        },
        totalPrice: 57000
      },
      {
        id: 'item-2',
        drinkId: 'chamomile-honey-red-apple',
        drinkName: 'Trà Hoa Cúc Mật Ong Táo Đỏ',
        drinkImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=700&auto=format&fit=crop&q=80',
        storeId: 'store-1',
        storeName: 'DailySip Flagship Nguyễn Du',
        storeAddress: '12 Nguyễn Du, P. Bến Nghé, Quận 1',
        unitPrice: 45000,
        quantity: 1,
        customization: {
          size: 'M',
          ice: 'Nóng',
          sweetness: '50%',
          toppings: [{ name: 'Nha đam tươi giòn', price: 7000 }],
          specialNote: 'Uống ấm'
        },
        totalPrice: 52000
      }
    ]
  },
  {
    id: 'ord-102',
    orderCode: 'DS-8712',
    createdAt: '28/08/2026, 09:15',
    status: 'delivered',
    storeName: 'The Sip Garden Pasteur',
    deliveryAddress: 'Số 45 Lê Lợi, Bến Nghé, Q.1',
    paymentMethod: 'Vietcombank Digital',
    subtotal: 104000,
    deliveryFee: 12000,
    discount: 10000,
    totalAmount: 106000,
    review: {
      rating: 5,
      comment: 'Đồ uống rất tươi ngon, vị bơ béo nhẹ thanh mát, shipper giao siêu nhanh chỉ 15 phút!',
      createdAt: '28/08/2026'
    },
    items: [
      {
        id: 'item-3',
        drinkId: 'avocado-banana-plant-protein',
        drinkName: 'Sinh Tố Bơ Chuối Đạm Thực Vật',
        drinkImage: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=700&auto=format&fit=crop&q=80',
        storeId: 'store-2',
        storeName: 'The Sip Garden Pasteur',
        storeAddress: '68 Pasteur, P. Bến Nghé, Quận 1',
        unitPrice: 65000,
        quantity: 1,
        customization: {
          size: 'L',
          ice: '50% đá',
          sweetness: '0%',
          toppings: [{ name: 'Hạt chia hữu cơ', price: 6000 }],
          specialNote: 'Ít ngọt'
        },
        totalPrice: 77000
      },
      {
        id: 'item-4',
        drinkId: 'fresh-coconut-calamansi-pink-salt',
        drinkName: 'Nước Dừa Tươi Tắc Muối Hồng',
        drinkImage: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=700&auto=format&fit=crop&q=80',
        storeId: 'store-2',
        storeName: 'The Sip Garden Pasteur',
        storeAddress: '68 Pasteur, P. Bến Nghé, Quận 1',
        unitPrice: 39000,
        quantity: 1,
        customization: {
          size: 'M',
          ice: '100% đá',
          sweetness: '30%',
          toppings: [],
          specialNote: ''
        },
        totalPrice: 39000
      }
    ]
  },
  {
    id: 'ord-103',
    orderCode: 'DS-6520',
    createdAt: '26/08/2026, 16:45',
    status: 'returned',
    storeName: 'Herbal Zen Tea House',
    deliveryAddress: 'Tòa nhà Bitexco, Q.1, TP.HCM',
    paymentMethod: 'Ví MoMo',
    subtotal: 42000,
    deliveryFee: 15000,
    discount: 0,
    totalAmount: 57000,
    items: [
      {
        id: 'item-5',
        drinkId: 'ginger-lemongrass-citrus-warm',
        drinkName: 'Trà Gừng Chanh Sả Mật Ong Nóng',
        drinkImage: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=700&auto=format&fit=crop&q=80',
        storeId: 'store-3',
        storeName: 'Herbal Zen Tea House',
        storeAddress: '150 Đồng Khởi, Bến Nghé, Quận 1',
        unitPrice: 42000,
        quantity: 1,
        customization: {
          size: 'M',
          ice: 'Nóng',
          sweetness: '30%',
          toppings: [{ name: 'Lát gừng sên mật ong', price: 6000 }],
          specialNote: 'Gừng cay ấm'
        },
        totalPrice: 48000
      }
    ]
  },
  {
    id: 'ord-104',
    orderCode: 'DS-4109',
    createdAt: '24/08/2026, 11:20',
    status: 'cancelled',
    storeName: 'Pure Green Detox Lab',
    deliveryAddress: 'Số 10 Hai Bà Trưng, Q.1',
    paymentMethod: 'Tiền mặt (COD)',
    subtotal: 55000,
    deliveryFee: 10000,
    discount: 5000,
    totalAmount: 60000,
    items: [
      {
        id: 'item-6',
        drinkId: 'pineapple-mint-kombucha',
        drinkName: 'Kombucha Dứa Bạc Hà Men Sống',
        drinkImage: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=700&auto=format&fit=crop&q=80',
        storeId: 'store-4',
        storeName: 'Pure Green Detox Lab',
        storeAddress: '88 Hàm Nghi, P. Bến Nghé, Quận 1',
        unitPrice: 55000,
        quantity: 1,
        customization: {
          size: 'M',
          ice: '50% đá',
          sweetness: '30%',
          toppings: [],
          specialNote: ''
        },
        totalPrice: 55000
      }
    ]
  }
];

