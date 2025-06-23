import BenchmarkManager from '../../../components/admin/BenchmarkManager';

const GPUBenchmarksPage = () => {
    return (
        <BenchmarkManager
            resourceName="gpu-benchmarks"
            title="Manage GPU Benchmarks"
            fileTypeHint="Upload a .csv, .xls, .xlsx, or .ods file with 'name' and 'score' columns."
        />
    );
};

export default GPUBenchmarksPage;