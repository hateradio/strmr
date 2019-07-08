import React from 'react';

const Selector = ({ label, list, onChange, value }) => {

    return (
        <label>{label}
            <select id={encodeURIComponent(label)} onChange={onChange} value={value}>
                {list.map((p, i) => (<option key={i} value={p}>{p}</option>))}
            </select>
        </label>
    )
}

export default Selector