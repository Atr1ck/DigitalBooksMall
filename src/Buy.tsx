import { TopBar } from "./Home";
import { usePageVisible } from "./Home";

export default function Buy(){
    const setHomeVisible = usePageVisible((state : any) => state.setHomeVisible);
    return (
      <div>
        <TopBar setHomeVisible={setHomeVisible}/>
      </div>
    )
}