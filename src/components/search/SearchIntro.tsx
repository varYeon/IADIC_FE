export default function SearchIntro() {
  return (
    <div>
      <div className="flex justify-center text-2xl font-bold">
        <p>찾고 싶은&nbsp;</p>
        <p className="text-main"> 훈수</p>
        <p>가 있나요?</p>
      </div>
      <p className="text-text-light flex flex-wrap justify-center px-5 sm:text-sm md:text-base">
        찾고자 하는 키워드를 검색하면 관련 훈수 모음들을 찾아드릴게요
      </p>
    </div>
  );
}
