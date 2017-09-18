import { h, render, Component } from 'preact';
import { CardDef } from './models'
import Cards from './cards'

interface AppProps {
    name: string
    id: string
}

export default class App extends Component<AppProps, any> {
    render(props) {
        var crds = Cards.slice(0,40);
        return <div className='flex-hor'>
            {crds.map((c) => {
                return <div className='flex-ver'>
                    <img className="card-image" src={c.RegImage}></img>
                    {c.Sounds.length ? <div className='flex-hor'>
                        <div className="btn-group" role="group" >
                            {c.Sounds.map((s)=>{
                                return <button type="button" className="btn btn-default">{s.Name}</button>
                            })}
                        </div>
                    </div>: null}

                </div>
            })}
        </div>
    }
}

render(
    <App name="World" id="/" />
    , document.querySelector('#app'));