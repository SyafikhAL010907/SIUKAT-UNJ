import React from "react";
import { FormText } from "reactstrap";

export class SyaratFoto extends React.Component {
    render() {
        return (
            <FormText color="muted">
                <ul className="list-reset">
                    <li>Wajah tampak jelas;</li>
                    <li>Posisi badan menghadap ke depan;</li>
                    <li>Memakai pakaian bebas, rapi, dan sopan;</li>
                    <li>Rasio 3:4 atau 4:6;</li>
                    <li>Warna latar merah.</li>
                    <li>Ekstensi gambar berupa JPG/JPEG/PNG;</li>
                    <li>Ukuran gambar tidak lebih dari 500KB.</li>
                </ul>
            </FormText>
        );
    }
}

export class SyaratScan extends React.Component {
    renderSyarat = () => {
        return Array.isArray(this.props.syarat)
            ? this.props.syarat.map((data, key) => <li key={key}>{data};</li>)
            : null;
    };
    render() {
        return (
            <FormText color="muted">
                <ul className="list-reset">
                    {this.renderSyarat()}
                    <li>Ekstensi berkas berupa PDF;</li>
                    <li>Ukuran berkas tidak lebih dari 500KB.</li>
                </ul>
            </FormText>
        );
    }
}
