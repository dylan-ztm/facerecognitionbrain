import React from 'react';
import Tilt from 'react-tilt';
import brain from './brain.png'; //link "brain" with "brain.png" file.
import './Logo.css';

const Logo = () => {
    return (
        <div className='ma4 mt0'>
            <Tilt className="Tilt br2 shadow-2" options={{ max : 45 }} style={{ height: 150, width: 150 }} >
                <div className="Tilt-inner pa3">
                    <img    style={{paddingTop: '5px'}}
                            src={brain} 
                            alt='Brain Icon'>
                    </img> 
                </div>
            </Tilt>
        </div>
    );
} //end Logo


export default Logo;