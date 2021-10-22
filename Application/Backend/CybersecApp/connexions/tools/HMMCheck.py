from ..models import HMMLearning
from .HMMConversion import HMMConversion
from .EuclidianDistance import search_similar


# in our first step, we'll only compare the transition matrix
def search_hmm_label(hmm_online):
    # we convert the hmmOnline model from string to matrix
    hmm_to_check = HMMConversion(hmm_online).get_global_transition_matrix()

    # now we extract all the labeled HMMLearning from database and we convert them
    hmms = HMMLearning.objects.filter(label__isnull=False)
    hmms_converted = []
    for hmm in hmms:
        hmms_converted.append(HMMConversion(hmm).get_global_transition_matrix())

    index, distance = search_similar(hmm_to_check, hmms_converted)

    # we return the label of similar hmm
    return hmms[index].label, distance
