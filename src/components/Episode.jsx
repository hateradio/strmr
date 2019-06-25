import React from 'react';

const Episode = props => {

    const change = e => {
        const id = e.target.id
        props.update({
            id: +props.id,
            number: id === 'episodeId' ? e.target.value : props.number,
            title: id === 'episodeName' ? e.target.value : props.title,
            uri: id === 'episodeUri' ? e.target.value : props.uri
        })
    }

    const remove = () => {
        props.delete(+props.id)
    }

    return (
        <React.Fragment>
            <div className="columns medium-3">
                <div>
                    <label>Episode No.
                    <input id="episodeId" placeholder="#" defaultValue={props.number} type="number" onChange={change} />
                    </label>
                </div>
                {' '}
                <label>Name
                    <input type="text" id="episodeName" placeholder="(Optional: Episode name)" defaultValue={props.title} onChange={change} />
                </label>
                {' '}
                <label>Link
                    <textarea id="episodeUri" placeholder="Stream Link" defaultValue={props.uri} onChange={change} style={{ height: "10em" }} />
                </label>
                <div>
                    <button type="button" className="button tiny" onClick={remove}>Delete</button>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Episode