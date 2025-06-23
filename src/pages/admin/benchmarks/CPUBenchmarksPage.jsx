import React from 'react';
import BenchmarkManager from '../../../components/admin/BenchmarkManager';

const CPUBenchmarksPage = () => {
    return (
        <BenchmarkManager
            resourceName="cpu-benchmarks"
            title="Manage CPU Benchmarks"
            fileTypeHint="Upload a .csv, .xls, .xlsx, or .ods file with 'name' and 'score' columns."
        />
    );
};

export default CPUBenchmarksPage;