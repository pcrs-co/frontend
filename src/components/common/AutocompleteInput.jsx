// src/components/common/AutocompleteInput.jsx

import React from 'react';
import clsx from 'clsx';

/**
 * A reusable input component with autocomplete/suggestions.
 * Uses the native HTML <datalist> for speed and accessibility.
 *
 * @param {string} name - The name for react-hook-form registration.
 * @param {string} label - The text for the label.
 * @param {function} register - The register function from react-hook-form.
 * @param {string} placeholder - The input's placeholder text.
 * @param {Array<string>} suggestions - An array of strings for the datalist.
 * @param {object} error - The error object from react-hook-form's formState.
 * @param {boolean} required - Whether the field is required.
 * @param {boolean} disabled - Whether the input is disabled.
 */
const AutocompleteInput = ({ name, label, register, placeholder, suggestions, error, required = false, disabled = false }) => {
    const datalistId = `${name}-suggestions`;

    return (
        <div className="form-control">
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            <input
                type="text"
                list={datalistId}
                placeholder={placeholder}
                {...register(name, { required: required ? `${label} is required.` : false })}
                className={clsx("input input-bordered w-full", { "input-error": error })}
                disabled={disabled}
            />
            <datalist id={datalistId}>
                {suggestions.map(item => <option key={item} value={item} />)}
            </datalist>
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error.message}</span>
                </label>
            )}
        </div>
    );
};

export default AutocompleteInput;