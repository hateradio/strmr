import React from 'react';

const Selector = ({ label, list, onChange, defaultValue }) => {

    return (
        <label>{label}
            <select id={encodeURIComponent(label)} onChange={onChange} defaultValue={defaultValue}>
                {list.map((p, i) => (<option key={i} value={p}>{p}</option>))}
            </select>
        </label>
    )
}

export default Selector