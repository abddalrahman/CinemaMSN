import Hero from "./componentes/home/Hero";
import MostPopularM from "./componentes/home/MostPopularM";
import MostPopularP from "./componentes/home/MostPopularP";
import MostPopularS from "./componentes/home/MostPopularS";
import MostPopularThisWeek from "./componentes/home/MostPopularThisWeek";
import ShowGenres from "./componentes/home/ShowGenres";
import ShowNews from "./componentes/home/ShowNews";
import TopRatedThisYear from "./componentes/home/TopRatedThisYear";

export default function Home() {
  return (
    <div>
      <Hero/>
      <MostPopularP/>
      <TopRatedThisYear/>
      <MostPopularM/>
      <MostPopularS/>
      <MostPopularThisWeek/>
      <ShowGenres/>
      <ShowNews/>
    </div>
  );
}
