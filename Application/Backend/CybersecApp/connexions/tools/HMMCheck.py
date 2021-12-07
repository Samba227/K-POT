from ..models import HMMLearning
from .HMMConversion import HMMConversion
from .EuclidianDistance import search_similar, is_suspicious


# in our first step, we'll only compare the emission matrix
def search_hmm_label(hmm_online):
    # we convert the hmmOnline model from string to matrix
    hmm_to_check = HMMConversion(hmm_online).get_global_emission_matrix()

    # now we extract all the labeled HMMLearning from database and we convert them
    hmms = HMMLearning.objects.all()
    if len(hmms) > 0:
        hmms_converted = []
        for hmm in hmms:
            hmms_converted.append(HMMConversion(hmm).get_global_emission_matrix())

        index, distance = search_similar(hmm_to_check, hmms_converted)

        # we return the label of similar hmm
        return hmms[index].label, distance
    else:
        return '', 100


def check_supspicious(hmm_online):
    hmm_to_check = HMMConversion(hmm_online).get_global_emission_matrix()

    hmms = HMMLearning.objects.all()
    if len(hmms) > 0:
        hmms_converted = []
        for hmm in hmms:
            hmms_converted.append(HMMConversion(hmm).get_global_emission_matrix())
        
        # return the minimum distance and a boolean
        return is_suspicious(hmm_to_check, hmms_converted)
    else:
        # by default, we return 0 as distance and True
        return 0, True