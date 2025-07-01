import React from 'react';
import BenchmarkManager from '../../../components/admin/BenchmarkManager';

const CPUBenchmarksPage = () => {
    return (
        <BenchmarkManager
            resourceName="cpu-benchmarks"
            title="CPU Benchmarks"
            fileTypeHint="Upload a file with 'cpuname' and 'cpumark' columns."
            nameField="cpu"
            scoreField="score"
        />
    );
};

export default CPUBenchmarksPage;