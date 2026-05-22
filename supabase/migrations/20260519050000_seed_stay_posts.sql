insert into public.stay_posts (id, title, price, content, image_urls, is_published, sort_order)
values
  (
    '11111111-1111-4111-8111-111111111111',
    '청풍발리호텔',
    '요금 문의',
    $$청풍호 수상레저장과 가까운 호텔형 숙소입니다. 짧은 이동으로 체크인 동선을 잡기 좋아 커플·가족 방문객이 레저 후 쉬어가기 좋습니다.
확인 링크: https://place.udanax.org/place.php?id=957532&placeName=%EC%B2%AD%ED%92%8D%EB%B0%9C%EB%A6%AC%ED%98%B8%ED%85%94$$,
    array['/images/stay-cheongpung-bali-hotel-exterior.webp'],
    true,
    1
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    '블루밍데이즈펜션',
    '요금 문의',
    $$청풍호와 비봉산 권역을 함께 둘러보기 좋은 펜션입니다. 개별 여행, 가족 일정, 바비큐 중심의 숙박 동선에 맞춰 안내하기 좋습니다.
홈페이지: http://www.bloomingdays.co.kr/$$,
    array['/images/stay-blooming-days-pension.webp'],
    true,
    2
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    '위고고',
    '요금 문의',
    $$청풍호 전망과 수영장·바비큐 이용을 함께 보기 좋은 감성 숙소입니다. 수상레저 후 휴식과 사진 촬영을 함께 원하는 일정에 어울립니다.
홈페이지: https://wegogo-jc.nowgo.kr/main/sub0201$$,
    array['/images/stay-wegogo.webp'],
    true,
    3
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    '람보캠핑장',
    '요금 문의',
    $$청풍호 조망 캠핑장으로 오토캠핑과 장박 문의에 맞는 야외형 숙소입니다. 개별 편의시설을 확인한 뒤 가족·단체 캠핑 일정에 연결하기 좋습니다.
홈페이지: http://rambocamp.com/$$,
    array['/images/stay-rambo-camping.webp'],
    true,
    4
  ),
  (
    '55555555-5555-4555-8555-555555555555',
    '호수풍경펜션',
    '요금 문의',
    $$청풍호 풍경을 내려다보는 펜션으로 조용한 호수 전망과 바비큐 일정을 함께 잡기 좋습니다. 레저 후 여유롭게 머무는 커플·가족 일정에 어울립니다.
홈페이지: https://greenlake.kr/$$,
    array['/images/stay-lake-view-pension.webp'],
    true,
    5
  ),
  (
    '66666666-6666-4666-8666-666666666666',
    '이른아침호숫가펜션',
    '요금 문의',
    $$청풍호 인근 호숫가 분위기의 펜션입니다. 객실과 주변 산책 동선을 함께 확인해 수상레저 전후 1박 일정으로 안내하기 좋습니다.
정보 확인: https://www.ktriptips.com/kor/stay/137920$$,
    array['/images/stay-early-morning-lake-pension.webp'],
    true,
    6
  ),
  (
    '77777777-7777-4777-8777-777777777777',
    '드림레이크펜션',
    '요금 문의',
    $$청풍호 주변 펜션형 숙소로 가족, 커플, 소규모 모임이 조용히 머물기 좋습니다. 호수권 드라이브와 레저 일정을 함께 묶어 안내하기 좋습니다.
홈페이지: http://www.dreamlakepension.com/$$,
    array['/images/stay-dream-lake-pension.webp'],
    true,
    7
  ),
  (
    '88888888-8888-4888-8888-888888888888',
    '청풍리조트레이크호텔',
    '요금 문의',
    $$청풍호반에 자리한 리조트형 호텔입니다. 객실, 식음, 연회 시설을 함께 확인할 수 있어 가족 여행과 단체 일정에 모두 연결하기 좋습니다.
홈페이지: https://www.cheongpungresort.co.kr/$$,
    array['/images/stay-cheongpung-resort-lake-hotel.webp'],
    true,
    8
  ),
  (
    '99999999-9999-4999-8999-999999999999',
    '청풍유스호스텔',
    '요금 문의',
    $$청풍권 단체 숙박과 수련 활동에 맞는 유스호스텔입니다. 학생 단체, 워크숍, 동호회 일정처럼 인원이 많은 숙박 문의에 안내하기 좋습니다.
홈페이지: https://chpungyh.co.kr/$$,
    array['/images/stay-cheongpung-youth-hostel.webp'],
    true,
    9
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '청풍리조트',
    '요금 문의',
    $$레이크호텔과 힐하우스를 함께 운영하는 청풍호 대표 리조트입니다. 숙박, 식사, 부대시설을 한 번에 확인하고 긴 일정의 가족·단체 여행에 붙이기 좋습니다.
홈페이지: https://www.cheongpungresort.co.kr/$$,
    array['/images/stay-cheongpung-resort.webp'],
    true,
    10
  )
on conflict (id) do update set
  title = excluded.title,
  price = excluded.price,
  content = excluded.content,
  image_urls = excluded.image_urls,
  is_published = excluded.is_published,
  sort_order = excluded.sort_order,
  updated_at = now();
