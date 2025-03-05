import { useState } from "react";

export function DeliveryProfessionalListComponent({ deliveryProfessionals = [], searchTermHandler }) {
    const [searchTerm,setSearchTerm]=useState('');
    function handleSearchTerm(e){
        e.preventDefault();
        setSearchTerm(e.target.value)
        searchTermHandler(e.target.value)
    }

    const filteredProfessionals = deliveryProfessionals.filter(professional =>
        professional.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <input
                type="text"
                className="form-control mb-2"
                placeholder="Search registered delivery professionals by name or email"                
                onChange={handleSearchTerm}
            />
            <ul className="list-group">
                {filteredProfessionals.map(professional => (
                    <li key={professional.id} className="list-group-item d-flex justify-content-between">
                        {professional.displayName} ({professional.email})
                        <button className="btn btn-sm btn-primary">Select</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}