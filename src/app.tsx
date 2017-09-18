import { h, render, Component } from 'preact';
import { CardDef } from './models'
import Cards from './cards'
import * as _ from 'underscore';
import { Howl } from 'howler';

interface AppProps {
    name: string
    id: string
}

export default class App extends Component<AppProps, any> {
    render(props: AppProps) {
        return <div className='container'>
            <Filterer AllCards={Cards} />
        </div>
    }
}


interface FilterProps {
    AllCards: CardDef[];
}
interface FilterState {
    FilteredCards: CardDef[];
    PageCards: CardDef[]; // split into rows. Precalculated.
    ShowGold: boolean;
}

var howlCache: { [url: string]: Howl } = {}

class Filterer extends Component<FilterProps, FilterState>{
    private pageSize = 10;
    constructor(props: FilterProps) {
        super(props);
        this.state = {
            FilteredCards: [],
            PageCards: [],
            ShowGold: false,
        }
        this.filter();
    }
    private filter() {
        var fc = _.filter(this.props.AllCards, (c) => c.Sounds.length > 0);
        fc = _.filter(fc, (c)=> c.Collectible);
        fc = _.sortBy(fc, (c) => c.Name);
        this.setState({ FilteredCards: fc });
    }
    private onPage = (cards: CardDef[]) => {
        this.setState({ PageCards: cards })
    }
    private playSound = (url: string) => {
        var h = new Howl({ src: "https://yoggstatic.hearth.cards/s" + url });
        h.play();
        console.log(url);
    }
    render(props: FilterProps) {
        var rows = _.values(_.groupBy(this.state.PageCards, (c: CardDef, i:number)=>Math.floor(i/5)))
        console.log(rows)
        return <div className='flex-ver'>
            <div className='filter-blocks'>
                {rows.map((cs) => {
                    return <div className='flex-hor'>
                        {cs.map((c) => {return <div className='filter-block flex-ver text-center'>
                            <div>
                                {c.GoldImage && this.state.ShowGold ? <video key={c.GoldImage} autoPlay={true} loop={true} class='filter-img'>
                                    <source src={'https://goldstatic.hearth.cards/img' + c.GoldImage}></source>
                                </video>
                                    : <img class='filter-img' src={'https://cardstatic.hearth.cards/img' + c.RegImage}></img>}
                            </div>
                            <div className='text-center'>
                                {c.Sounds.map((s) => {
                                    return <button className='btn btn-xs btn-primary' onClick={this.playSound.bind(this, s.URL)}>{s.Name}</button>
                                })}
                            </div>
                        </div>})}
                    </div>
                })}
            </div>
            <hr />
            <Pager AllItems={this.state.FilteredCards} PageSize={10} OnChange={this.onPage} />
        </div>
    }
}

interface PagingProps<T> {
    AllItems: T[];
    PageSize: number;
    OnChange(items: T[]): void;
}
interface PagingState<T> {
    CurrentPage: number;
}
class Pager<T> extends Component<PagingProps<T>, PagingState<T>>{
    constructor(props) {
        super(props);
        this.state = { CurrentPage: 0 }
        this.repage(0);
    }
    private repage(diff: number) {
        var p = this.props;
        var ps = p.PageSize;

        var cp = Math.min(this.state.CurrentPage + diff, this.maxPage());
        if (cp < 0) { cp = 0 };
        var start = cp * ps;
        var end = Math.min(((cp + 1) * ps) - 1, p.AllItems.length - 1);
        var set = p.AllItems.slice(start, end + 1);
        this.setState({
            CurrentPage: cp,
        })
        p.OnChange(set);
    }
    private next = () => {
        this.repage(1);
    }
    private prev = () => {
        this.repage(-1);
    }
    render(props) {
        var s = this.state;
        return <div className='text-center'><button onClick={this.prev}>&lt;</button>{s.CurrentPage} / {this.maxPage()}<button onClick={this.next}>&gt;</button></div>
    }
    private maxPage(): number {
        return Math.ceil(this.props.AllItems.length / this.props.PageSize) - 1;
    }
}

render(
    <App name="World" id="/" />
    , document.querySelector('#app'));