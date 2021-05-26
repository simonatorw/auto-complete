/**
 * This file will hold the Menu that lives at the top of the Page, this is all rendered using a React Component...
 * 
 */
import React from 'react';
import { debounce } from 'lodash';

const URL = 'http://localhost:3035/';

class Menu extends React.Component {

    /**
     * Main constructor for the Menu Class
     * @memberof Menu
     */
    constructor() {
        super();
        this.myRef = React.createRef();
        this.state = {
            showingSearch: false,
            results: []
        };
    }

    /**
     * Shows or hides the search container
     * @memberof Menu
     * @param e [Object] - the event from a click handler
     */

    showSearchContainer(e) {
        e.preventDefault();
        this.setState({
            showingSearch: !this.state.showingSearch
        }, () => this.state.showingSearch === true && this.myRef.current.focus());
    }

    /**
     * Calls upon search change
     * @memberof Menu
     * @param e [Object] - the event from a text change handler
     */
    onSearch(e) {
        
        // Start Here
        // ...
        e.persist();
        const term = e.target.value;

        if (term.length > 1) {
            if (!this.debouncedFn) {
                this.debouncedFn =  debounce(() => {
                    fetch(URL)
                        .then(res => res.json())
                        .then(data => {
                            const results = data.filter(item => item.name.toLowerCase().includes(term.toLowerCase()));
                            this.setState({ results });
                        });
                }, 300);
            }
            
            this.debouncedFn(); 
        } else {
            this.setState({ results: [] });
        }
    }

    clear() {
        this.myRef.current.value = '';
        this.setState({ results: [] });
        this.myRef.current.focus();
    }

    /**
     * Renders the default app in the window, we have assigned this to an element called root.
     * 
     * @returns JSX
     * @memberof App
    */
    render() {
        return (
            <header className="menu">
                <div className="menu-container">
                    <div className="menu-holder">
                        <h1>ELC</h1>
                        <nav>
                            <a href="#" className="nav-item">HOLIDAY</a>
                            <a href="#" className="nav-item">WHAT'S NEW</a>
                            <a href="#" className="nav-item">PRODUCTS</a>
                            <a href="#" className="nav-item">BESTSELLERS</a>
                            <a href="#" className="nav-item">GOODBYES</a>
                            <a href="#" className="nav-item">STORES</a>
                            <a href="#" className="nav-item">INSPIRATION</a>

                            <a href="#" onClick={(e) => this.showSearchContainer(e)}>
                                <i className="material-icons search">search</i>
                            </a>
                        </nav>
                    </div>
                </div>
                <div className={(this.state.showingSearch ? "showing " : "") + "search-container"}>
                    <input type="text" onChange={(e) => this.onSearch(e)} ref={this.myRef} />
                    <a href="#" onClick={(e) => this.showSearchContainer(e)}>
                        <i className="material-icons close">close</i>
                    </a>
                    {!!this.state.results.length && (
                        <div className="results" onClick={() => this.clear()}>
                            <ul>
                                {this.state.results.map((item, i) => <li className="item" key={`${item.name}_${i}`}>{item.name}</li>)}
                            </ul>
                        </div>
                    )}
                </div>
            </header>
        );
    }


}

// Export out the React Component
module.exports = Menu;