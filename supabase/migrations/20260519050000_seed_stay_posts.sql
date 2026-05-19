insert into public.stay_posts (id, title, price, content, image_urls, is_published, sort_order)
values
  (
    '11111111-1111-4111-8111-111111111111',
    '청풍호 전망 샘플 펜션',
    '1박 120,000원부터',
    '청풍호 주변 숙박 더미데이터입니다. 수상레저 이용 후 차량 이동이 편한 숙소 예시로, 객실 구성과 예약 가능 여부는 실제 등록 전 관리자에서 수정해 주세요.' || E'\n' || '예약 안내 URL 예시: https://example.com/stay/lake-view',
    array['/images/hero-sunset-boat.webp', '/images/workshop.webp', '/images/cheongpung-cruise.webp'],
    true,
    1
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    '가족형 샘플 숙소',
    '1박 150,000원부터',
    '가족 단위 방문객에게 맞춘 숙박 정보 예시입니다. 기준 인원, 추가 인원 요금, 바비큐 가능 여부 등을 본문에 정리해 등록할 수 있습니다.' || E'\n' || '상세 문의: https://example.com/stay/family-house',
    array['/images/atv-family.webp', '/images/paddle-boat.webp'],
    true,
    2
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    '단체 워크샵 샘플 숙박',
    '단체 요금 별도 문의',
    '워크샵, 동호회, 단체 일정에 맞춘 숙박 더미데이터입니다. 수상레저 패키지와 함께 안내할 때 사용할 수 있는 본문 구성 예시입니다.',
    array['/images/workshop.webp', '/images/night-party.webp', '/images/banana-boat.webp'],
    true,
    3
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    '커플형 샘플 레이크스테이',
    '1박 95,000원부터',
    '커플 방문객을 위한 숙박 안내 예시입니다. 체크인 시간, 객실 전망, 주변 산책 코스 등을 관리자 페이지에서 수정해 사용할 수 있습니다.',
    array['/images/cheongpung-cruise.webp', '/images/hero-sunset-boat.webp'],
    true,
    4
  ),
  (
    '55555555-5555-4555-8555-555555555555',
    '풀빌라 샘플 숙소',
    '1박 220,000원부터',
    '프라이빗 객실과 물놀이 시설을 강조하는 숙박 더미데이터입니다. 실제 이미지와 가격으로 교체해서 사용해 주세요.',
    array['/images/motorboat.webp', '/images/hero-sunset-boat.webp'],
    true,
    5
  ),
  (
    '66666666-6666-4666-8666-666666666666',
    '합리형 샘플 숙박',
    '1박 60,000원부터',
    '짧은 일정이나 당일 레저 후 숙박이 필요한 방문객을 위한 합리형 숙박 예시입니다. 주차, 입실 시간, 주변 편의시설 정보를 함께 적으면 좋습니다.',
    array['/images/atv-lakeside.webp', '/images/kakao-map-seongnaeri-157.webp'],
    true,
    6
  ),
  (
    '77777777-7777-4777-8777-777777777777',
    '반려동물 동반 샘플 숙소',
    '1박 130,000원부터',
    '반려동물 동반 가능 여부를 안내하는 숙박 더미데이터입니다. 동반 조건, 추가 비용, 제한 사항을 본문에 명확히 작성하는 용도로 사용할 수 있습니다.',
    array['/images/oksunbong-bridge.webp', '/images/neunggang-valley.webp'],
    true,
    7
  ),
  (
    '88888888-8888-4888-8888-888888888888',
    '캠핑 캐빈 샘플 숙소',
    '1박 80,000원부터',
    '야외형 숙소나 글램핑 느낌의 숙박 정보를 등록할 때 쓰는 예시입니다. 숯불 이용, 취사 가능 여부, 침구 제공 여부 등을 입력할 수 있습니다.',
    array['/images/cheongpung-cultural-heritage.webp', '/images/jadrakgil.webp'],
    true,
    8
  ),
  (
    '99999999-9999-4999-8999-999999999999',
    '리조트형 샘플 객실',
    '1박 180,000원부터',
    '리조트형 숙박 안내 더미데이터입니다. 객실 타입, 조식, 부대시설, 예약 링크를 함께 표시하는 상세페이지 예시입니다.' || E'\n' || '예약 링크: https://example.com/stay/resort-room',
    array['/images/cheongpung-cable-car.webp', '/images/cheongpung-land.webp'],
    true,
    9
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '대형 객실 샘플 숙소',
    '1박 250,000원부터',
    '여러 명이 함께 머무는 대형 객실용 숙박 더미데이터입니다. 기준 인원, 최대 인원, 단체 예약 가능 시간대를 안내할 수 있습니다.',
    array['/images/bandwagon.webp', '/images/big-marble.webp', '/images/night-party.webp'],
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
