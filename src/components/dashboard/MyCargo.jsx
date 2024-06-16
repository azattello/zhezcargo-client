import React from "react";
import './css/admin.css';
import Title from "./title";
import StatusList from "./StatusList";
import FilialList from "./FilialList";
import Settings from "./Settings";


const MyCargo = () => {

    return (
      
        <div className="my-cargo">
            <Title text="Мой карго"/>
            <div className="section-my-cargo">
                <Settings/>
            </div>
            <div className="section-my-cargo">
                <StatusList/>
                <FilialList/>

            </div>


        </div>

    )
}

export default MyCargo;