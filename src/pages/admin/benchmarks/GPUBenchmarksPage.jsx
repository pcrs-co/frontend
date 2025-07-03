import React from 'react';
import BenchmarkManager from '../../../components/admin/BenchmarkManager';

const GPUBenchmarksPage = () => {
    return (
        <BenchmarkManager
            resourceName="gpu-benchmarks"
            title="GPU Benchmarks"
            fileTypeHint="Upload a file with 'videocardname' and 'g3dmark' columns."
            nameField="gpu"
            scoreField="score"
        />
    );
};

export default GPUBenchmarksPage;